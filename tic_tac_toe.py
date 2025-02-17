import math

class Board:
    def __init__(self):
        self.X = "X"
        self.O = "O"
        self.EMPTY = " "
        self.board = [[self.EMPTY] * 3 for _ in range(3)]

    # Game board drawing function
    def draw_board(self):
        for i, row in enumerate(self.board):
            print(" | ".join(row))
            if i < 2:
                print("---------")
        print()

    # Valid input checking
    def input_and_check(self, move):
        i, j = move
        if 0 <= i < 3 and 0 <= j < 3 and self.board[i][j] == self.EMPTY:
            self.board[i][j] = self.O
            return True
        else:
            print("Invalid move. Please enter row(0-2) and col(0-2).")
            return False

    # Checking for winner
    def check_winner(self):
        # Check rows and columns
        for i in range(3):
            if self.board[i][0] == self.board[i][1] == self.board[i][2] and self.board[i][0] != self.EMPTY:
                return self.board[i][0]  # Row win
            if self.board[0][i] == self.board[1][i] == self.board[2][i] and self.board[0][i] != self.EMPTY:
                return self.board[0][i]  # Column win

        # Check diagonals
        if self.board[0][0] == self.board[1][1] == self.board[2][2] and self.board[0][0] != self.EMPTY:
            return self.board[0][0]  # Main diagonal
        if self.board[0][2] == self.board[1][1] == self.board[2][0] and self.board[0][2] != self.EMPTY:
            return self.board[0][2]  # Anti-diagonal

        return None  # No winner

    # Checking for draw
    def is_terminal(self):
        return self.check_winner() is not None or all(cell != self.EMPTY for row in self.board for cell in row)


class Minimax(Board):
    def __init__(self):
        super().__init__()

    # Minimax algorithm for AI move
    def minimax(self, depth, is_AI):
        winner = self.check_winner()
        if winner == self.X:
            return 1
        elif winner == self.O:
            return -1
        elif self.is_terminal():
            return 0

        if is_AI:
            best_score = -math.inf
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == self.EMPTY:
                        self.board[i][j] = self.X
                        score = self.minimax(depth + 1, False)
                        self.board[i][j] = self.EMPTY
                        best_score = max(best_score, score)
            return best_score
        else:
            best_score = math.inf
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == self.EMPTY:
                        self.board[i][j] = self.O
                        score = self.minimax(depth + 1, True)
                        self.board[i][j] = self.EMPTY
                        best_score = min(best_score, score)
            return best_score

    # Calculating the best move using minimax algorithm
    def best_move(self):
        best_score = -math.inf
        move = (-1, -1)
        for i in range(3):
            for j in range(3):
                if self.board[i][j] == self.EMPTY:
                    self.board[i][j] = self.X
                    score = self.minimax(0, False)
                    self.board[i][j] = self.EMPTY

                    if score > best_score:
                        best_score = score
                        move = (i, j)
        return move

    def run(self):
        self.draw_board()
        while True:
            # Player move
            while True:
                try:
                    user_move = tuple(map(int, input("Enter row and column (0-2): ").split()))
                    if self.input_and_check(user_move):
                        break
                except ValueError:
                    print("Invalid input. Please enter two numbers separated by a space.")

            self.draw_board()
            if self.check_winner():
                print(f"Winner is: {self.check_winner()}")
                return
            if self.is_terminal():
                print("It's a draw!")
                return

            # AI move
            i, j = self.best_move()
            if i == -1 or j == -1:
                print("It's a draw!")
                return

            self.board[i][j] = self.X
            self.draw_board()
            if self.check_winner():
                print(f"Winner is: {self.check_winner()}")
                return
            if self.is_terminal():
                print("It's a draw!")
                return


if __name__ == "__main__":
    game = Minimax()
    game.run()
