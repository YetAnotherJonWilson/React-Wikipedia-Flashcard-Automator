# Wikipedia Flashcard Automator
Uses Wikipedia's API to automate the process of building flashcard decks from Wikipedia lists and page extracts

## Work in Progress
The app currently uses a search form, where a user can input the title of a Wikipedia list page. It then uses a GET request to Wikipedia's API to get a list of Wikipedia Categories found on that page. The user chooses a Category to iterate over to build a list of page titles to use for building a flashcard deck.

## Next steps:
- ~~If the categories returned don't yield an appropriate result, allow the user to continue searching with the new categories for a better result.~~
- ~~When the right list is found, allow the user to select it~~
- From results, create a deck of flashcards, one card per each page title, with the page title as the front of the card, and the page extract on the back
- Then allow a user to edit the extract to highlight certain fields, and delete some text if the extract is very long.
