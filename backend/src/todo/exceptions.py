class DatabasePrimaryKeyViolationException(Exception):
    def __init__(self, message="Database primary key violation"):
        self.message = message
        super().__init__(self.message)
