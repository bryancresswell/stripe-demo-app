from enum import Enum

class ProductType(Enum):
    book = "book"
    accessories = "accessories"

class ProductSubType(Enum):
    fiction = "fiction"
    mystery = "mystery"
    science_fiction = "science_fiction"
    fantasy = "fantasy"
    biography = "biography"
    romance = "romance"
    historical_fiction = "historical_fiction"
    thriller = "thriller"
    young_adult = "young_adult"