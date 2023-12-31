// book class : represent a book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// ui class : handle ui task
class ui {
  static displayBook() {
    const books = store.getBooks();

    books.forEach((book) => {
      return ui.addBookToList(book);
    });
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#"  class="btn btn-danger btn-sm delete">X</a></td>
     `;

    list.appendChild(row);
  }

  static deletBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // vanish in 3 second
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//store class : handle storage
class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }
  static addBook(book) {
    const books = store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Events: display Books
document.addEventListener("DOMContentLoaded", ui.displayBook);
//events:  add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //   get form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("please fill all the fields", "danger");
  } else {
    // instatiate book
    const book = new Book(title, author, isbn);

    // add book to ui
    ui.addBookToList(book);

    // add Book to storeage
    store.addBook(book);

    // show success msg
    ui.showAlert("book Added", "success");

    // clear fileds
    ui.clearFields();
  }
});

//events: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  ui.deletBook(e.target);
  //   show delete alert
  ui.showAlert("Book Delete SuccessFully", "success");
  //   remove Books from storeage
  store.removeBook(e.target.parentElement.previousElementSibling.textContent)
});
