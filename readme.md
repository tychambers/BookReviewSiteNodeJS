Directions for use. Download the files and open in VS code. Run an "npm i" command using git bash terminal to download the require dependencies. Then use nodemon index.js to run the site. This will default to running the site on port 3000
Prior to running the site you may need to set up a postgreSQL database. I have provided the queries for adding the required table in the "query.sql" file. You can run this on the database.

This application is a website that allows you to post book reviews for books you have recently read. It then sends an API request to https://openlibrary.org/ to find the book name, author and image for a book cover. It saves all of this in a database for persistence. There is also an API feature which allows you to view or add reviews through API requests.

-Tyler
