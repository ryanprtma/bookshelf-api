const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  const isNamed = books.filter((book) => book.name === name)[0].name !== undefined;
  const isValidPage = readPage <= pageCount;

  if (!isNamed) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (!isValidPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (isSuccess && isNamed && isValidPage) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished } = request.query;
  const reqName = request.query.name;

  const readingStatus = '0';
  const finishedRead = '0';

  const newBooks = (data) => data.map((item) => {
    const { id, name, publisher } = item;
    return { id, name, publisher };
  });

  if (reqName !== undefined) {
    const bookContainReqName = books.filter((n) => {
      const newBook = n.name.toLowerCase().includes(reqName.toLowerCase());
      return newBook;
    });
    const response = h.response({
      status: 'success',
      data: {
        books: newBooks(bookContainReqName),
      },
    });
    return response;
  }

  if (finished !== undefined) {
    if (finished !== finishedRead) {
      const filteredBook = books.filter((n) => n.finished === true);
      const response = h.response({
        status: 'success',
        data: {
          books: newBooks(filteredBook),
        },
      });
      return response;
    } if (finished === finishedRead) {
      const filteredBook = books.filter((n) => n.finished === false);
      const response = h.response({
        status: 'success',
        data: {
          books: newBooks(filteredBook),
        },
      });
      return response;
    }
  }

  if (reading !== undefined) {
    if (reading !== readingStatus) {
      const filteredBook = books.filter((n) => n.reading === true);
      const response = h.response({
        status: 'success',
        data: {
          books: newBooks(filteredBook),
        },
      });
      return response;
    } if (reading === readingStatus) {
      const filteredBook = books.filter((n) => n.reading === false);
      const response = h.response({
        status: 'success',
        data: {
          books: newBooks(filteredBook),
        },
      });
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: newBooks(books),
    },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  const isValidPage = readPage <= pageCount;
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (!isValidPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1 && name !== undefined && isValidPage) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler,
};
