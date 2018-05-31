# Wikipedia Flashcard Automator

Uses Wikipedia's API to automate the process of building lists of items to study from Wikipedia lists, using page extracts.

## ~~Work in Progress~~ MVP Complete

The app currently uses a search form, where a user can input the title of a Wikipedia list page. It then uses a GET request to Wikipedia's API to get a list of Wikipedia Categories found on that page. The user chooses a Category to iterate over to build a list of page titles to use for building a list of cards (as an accordion panel group) to study.

## Next steps:

* ~~If the categories returned don't yield an appropriate result, allow the user to continue searching with the new categories for a better result.~~
* ~~When the right list is found, allow the user to select it.~~
* ~~From results, create a deck of flashcards, one card per each page title, with the page title as the front of the card, and the page extract on the back.~~
* Remove HTML tags from page extracts (probably use regex for this).
* Some larger lists don't seem to work when creating decks--debug.
* When using the back button to return to search view, persist the button visibility state (this might be due to setState function clearing most state when leaving page).
* Maybe add instructions about how to use Wikipedia list titles as a starting point, and the difference between a list page title a category title.
* Maybe add note about how the app saves to localstorage, removing need for login.
* Refactor search button to allow for entering either a category title or a list page title as a starting point.
