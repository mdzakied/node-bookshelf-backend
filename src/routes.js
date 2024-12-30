// Import Handler
const {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    // Add Book
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    // Show Books
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    // Show Detail Book
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    // Edit Book
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    // Delete Book
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
