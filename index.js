import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookReviews",
    password: "Admin123!!!",
    port: 5432,
  });
  db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getReviews() {
    const result = await db.query("SELECT * FROM reviews ORDER BY recommendation DESC");
    return result.rows;
}

app.get("/", async (req, res) => {
    const books = await getReviews();
    res.render("index.ejs", {books})
});

app.post("/add", async (req, res) => {
    var bookTitle = req.body.bookTitleInput;
    const bookQuery = bookTitle.trim().replace(/\s+/g, "+");
    const apiUrl = "https://openlibrary.org/search.json?title=" + bookQuery + "&lang=EN";
    try {
        const response = await axios.get(apiUrl);
        const result = response.data;
        const oclcNumber = result.docs[0].oclc[0];
        const author = result.docs[0].author_name[0];
        const title = result.docs[0].title;
        try {
            db.query("INSERT INTO reviews (title, author, readdate, recommendation, oclc, review) VALUES ($1, $2, $3, $4, $5, $6)", 
                [title, author, req.body.readDateInput, req.body.recInput, oclcNumber, req.body.reviewInput])
                res.redirect("/");
        } catch (error) {
            const message = "Could not find a book by that title. Please try again.";
            const books = await getReviews();
            res.render("index.ejs", {books, error: message});
        }
    } catch (error) {
        const message = "Could not find a book by that title. Please try again.";
        const books = await getReviews();
        res.render("index.ejs", {books, error: message});
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.bookId;
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.redirect("/");
});

app.post("/edit", async (req, res) => {
    await db.query("UPDATE reviews SET readdate = $1, recommendation = $2, review = $3 WHERE id = $4", 
        [req.body.updatedItemReadDate,req.body.updatedItemRecommendation, req.body.updatedReview, req.body.updatedItemId])
    res.redirect("/");
});

// BELOW IS API ENDPOINTS

app.get("/getReviews", async (req, res) => {
    const result = await getReviews();
    res.json(result);
});

app.post("/addReview", async (req, res) => {
    var bookTitle = req.body.title;
    const bookQuery = bookTitle.trim().replace(/\s+/g, "+");
    const apiUrl = "https://openlibrary.org/search.json?title=" + bookQuery + "&lang=EN";
    try {
        const response = await axios.get(apiUrl);
        const result = response.data;
        const oclcNumber = result.docs[0].oclc[0];
        const author = result.docs[0].author_name[0];
        const title = result.docs[0].title;
        try {
            db.query("INSERT INTO reviews (title, author, readdate, recommendation, oclc, review) VALUES ($1, $2, $3, $4, $5, $6)", 
                [title, author, req.body.readdate, req.body.recommendation, oclcNumber, req.body.review])
            res.status(201).json({ message: 'Data received successfully' });
        } catch {
            return res.status(500).json({ error: 'Unable to add entry to the database.' });
        }
    } catch {
        return res.status(400).json({ error: 'Unable to process data in API request to openlibrary.org.' });
    }
});

app.get("/apiDocs", async (req, res) => {
    res.render("apiDocs.ejs")
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});