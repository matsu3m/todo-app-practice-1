class DatabasePrimaryKeyViolationException(Exception):
    def __init__(self, message="Database primary key violation"):
        self.message = message
        super().__init__(self.message)


class DatabasePermissionDeniedException(Exception):
    def __init__(self, message="Database permission denied"):
        self.message = message
        super().__init__(self.message)
