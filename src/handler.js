// Import Nanoid for Random ID
const { nanoid } = require('nanoid');
// Import State Book
const books = require('./books');

// Add Book Handler
const addBookHandler = (request, h) => {

  // Declare Variable for Payload
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Response Fail Add Book without Payload 'name'
  if (!name || name === '') {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  // Response Fail Add Book with Payload 'readPage' > 'pageCount'
  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  // Initialize Variable from Server
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Initialize 'newBook' with Payload Data
  const newBook = { id, finished, insertedAt, updatedAt, name, year, author, summary, publisher, pageCount, readPage, reading };

  // Push to 'newBook'
  books.push(newBook);

  // Initialize 'filteredBookById' from Available Book after Add Book
  const filteredBookById = books.filter((book) => book.id === id).length > 0;

  // Response Success Add Book
  if (filteredBookById) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  // Response Fail Add Book
  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
  return response;
};

// Get All Book Handler
const getAllBooksHandler = (request, h) => {

  // Declare Variable for Query Parameter 
  const { name, reading, finished } = request.query;

  // Declare Variable 'FilteredBooks' default with state books
  let filteredBooks = books

  // Declare Variable 'FilterAny' for Conditional Query Parameter
  // let filterNameBooks = false
  let filterReadingBooks = false
  let filterFinishedBooks = false

  // // Conditional Query Parameter 'name'
  // if (name || !name === '') {
  //   filterNameBooks = true
  // }

  // Conditional Query Parameter 'reading'
  if (reading) {
    filterReadingBooks = true
  }

  // Conditional Query Parameter 'finished'
  if (finished) {
    filterFinishedBooks = true
  }

  // Initialize 'FilteredBooks' with Filter Query Parameter
  filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name ? name.toLowerCase() : '')
    && (filterReadingBooks ? book.reading == reading : true)
    && (filterFinishedBooks ? book.finished == finished : true)
  )

  // Response Success Get All Book with Query Parameter
  const response = h
    .response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
  return response;
};

// Get Detail Book Handler
const getBookByIdHandler = (request, h) => {

  // Declare Variable for Path Parameter
  const { bookId } = request.params;

  // Initialize 'filteredBookById' from Available Book
  const filteredBookById = books.filter((book) => book.id === bookId)[0];

  // Response Success Get Detail Book
  if (filteredBookById) {
    const response = h
      .response({
        status: 'success',
        data: {
          book: filteredBookById,
        },
      })
      .code(200);
    return response;
  }

  // Response Fail Get Detail Book Invalid ID
  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};


// Edit Book Handler
const editBookByIdHandler = (request, h) => {

  // Declare Variable for Path Parameter
  const { bookId } = request.params;

  // Declare Variable for Payload
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Response Fail Edit Book without Payload 'name'
  if (!name || name === '') {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  // Response Fail Edit Book with Payload 'readPage' > 'pageCount'
  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  // Initialize Variable from Server
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  // Initialize 'filteredBookById' from Available Book
  const filteredBookById = books.findIndex((book) => book.id === bookId); // find book by id

  // Response Success Edit Book
  if (filteredBookById !== -1) {
    books[filteredBookById] = {
      ...books[filteredBookById],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  // Response Fail Edit Book Invalid ID
  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

// Delete Book Handler
const deleteBookByIdHandler = (request, h) => {

  // Declare Variable for Path Parameter
  const { bookId } = request.params;

  // Initialize 'filteredBookById' from Available Book
  const findBookById = books.findIndex((book) => book.id === bookId);

  // Response Success Edit Book
  if (findBookById !== -1) {

    // Splice for Delete Book
    books.splice(findBookById, 1);

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }

  // Response Fail Delete Book Invalid ID
  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};