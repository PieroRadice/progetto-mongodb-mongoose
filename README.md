# Progetto Didattico MongoDB/Mongoose

Progetto educativo per l'apprendimento di MongoDB e Mongoose con Express.js.

## Requisiti

- Node.js
- Account MongoDB Atlas

## Installazione

1. Clona il repository
```bash
git clone <url-repository>
cd pr
```

2. Installa le dipendenze
```bash
npm install
```

3. Configura le variabili d'ambiente
- Copia `.env.example` in `.env`
- Inserisci la tua stringa di connessione MongoDB Atlas

4. Avvia l'applicazione
```bash
npm start
```

## Struttura del Progetto

- `models/` - Modelli Mongoose (Post, Books)
- `routes/` - Route Express (posts, books, cavalli)
- `app.js` - File principale dell'applicazione

## API Endpoints

### Posts
- `GET /posts` - Ottieni tutti i post
- `POST /posts` - Crea un nuovo post
- `GET /posts/:postID` - Ottieni un post specifico
- `PATCH /posts/:postID` - Aggiorna un post
- `DELETE /posts/:postID` - Elimina un post

### Books
- `GET /books` - Ottieni tutti i libri
- `POST /books` - Crea un nuovo libro
- `GET /books/:bookID` - Ottieni un libro specifico (con conteggio autori)
- `PATCH /books/:bookID` - Aggiorna un libro
- `DELETE /books/:bookID` - Elimina un libro

## Note

Questo progetto è stato convertito da Sequelize a MongoDB/Mongoose per scopi didattici.
