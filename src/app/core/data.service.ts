import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';
import { Observable } from 'rxjs';
import { OldBook } from 'app/models/oldBook';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[]> {
    console.log('Getting all books from the server.');
    return this.http.get<Book[]>('/api/books');       // gets books at /api/books and returns an array of Books
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'my-token'
      })
    });
  }  

  getOldBookById(id: number): Observable<OldBook> {
     return this.http.get<Book>(`/api/books/${id}`)
       .pipe(
         map(b => <OldBook>{
           bookTitle: b.title,
           year: b.publicationYear
         }),
         tap(classicBook => console.log(classicBook))     // prints selected book title and publication year in the console
         );
  }

  addBook(newBook: Book): Observable<Book>{
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBook(updatedBook: Book): Observable<void>{
    // use put to update
    return this.http.put<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {     // nothing is returned when an update is made
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  deleteBook(bookID: number): Observable<void>{
    return this.http.delete<void>(`/api/books/${bookID}`);
  }
    
}
