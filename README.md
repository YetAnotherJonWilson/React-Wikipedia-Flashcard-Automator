# Wikipedia Flashcard Automator
Uses Wikipedia's API to automate the process of building flashcard decks from Wikipedia lists and page extracts

## Work in Progress
The app currently uses a simple GET request to Wikipedia's API to get a page extract using a pageid, and log it to the console.

## Next steps:
- Build a UI that allows a user to enter a title of a Wikipedia List page, then iterate over the list and use the pageids to create simple flashcards with the title of each page on the front, and the page's "extract" field on the flip side.
- Then allow a user to edit the extract to highlight certain fields, and delete some text if the extract is very long.
