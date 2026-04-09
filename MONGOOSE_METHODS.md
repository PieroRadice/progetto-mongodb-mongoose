# Guida ai Metodi Principali di Mongoose

## Indice
1. [Connessione al Database](#connessione-al-database)
2. [Definizione degli Schema](#definizione-degli-schema)
3. [Metodi di Query](#metodi-di-query)
4. [Metodi di Creazione](#metodi-di-creazione)
5. [Metodi di Aggiornamento](#metodi-di-aggiornamento)
6. [Metodi di Eliminazione](#metodi-di-eliminazione)
7. [Metodi Custom](#metodi-custom)
8. [Validazione](#validazione)

---

## Connessione al Database

### `mongoose.connect()`
Connette l'applicazione a MongoDB.

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nomeDatabase')
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore di connessione:', err));

// Con opzioni
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

---

## Definizione degli Schema

### `mongoose.Schema()`
Definisce la struttura dei documenti.

```javascript
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  età: {
    type: Number,
    min: 0,
    max: 120
  },
  attivo: {
    type: Boolean,
    default: true
  },
  dataRegistrazione: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  indirizzo: {
    via: String,
    città: String,
    cap: String
  }
});

const User = mongoose.model('User', userSchema);
```

---

## Metodi di Query

### `find()`
Trova tutti i documenti che corrispondono ai criteri.

```javascript
// Trova tutti
const users = await User.find();

// Trova con filtro
const users = await User.find({ attivo: true });

// Con condizioni multiple
const users = await User.find({ 
  età: { $gte: 18 },
  attivo: true 
});

// Seleziona solo alcuni campi
const users = await User.find().select('nome email');

// Limita risultati
const users = await User.find().limit(10);

// Ordina
const users = await User.find().sort({ nome: 1 }); // 1 = ascendente, -1 = discendente
```

### `findOne()`
Trova il primo documento che corrisponde ai criteri.

```javascript
const user = await User.findOne({ email: 'test@example.com' });

if (!user) {
  console.log('Utente non trovato');
}
```

### `findById()`
Trova un documento tramite il suo ID.

```javascript
const user = await User.findById('507f1f77bcf86cd799439011');

// Con gestione errori
try {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('Utente non trovato');
  res.json(user);
} catch (err) {
  res.status(400).send('ID non valido');
}
```

### `countDocuments()`
Conta i documenti che corrispondono ai criteri.

```javascript
const count = await User.countDocuments({ attivo: true });
console.log(`Utenti attivi: ${count}`);
```

### `exists()`
Verifica se esiste almeno un documento che corrisponde ai criteri.

```javascript
const exists = await User.exists({ email: 'test@example.com' });
if (exists) {
  console.log('Email già registrata');
}
```

---

## Metodi di Creazione

### `save()`
Salva un nuovo documento o aggiorna uno esistente.

```javascript
// Crea una nuova istanza
const user = new User({
  nome: 'Mario Rossi',
  email: 'mario@example.com',
  età: 30
});

// Salva nel database
try {
  const savedUser = await user.save();
  console.log('Utente salvato:', savedUser);
} catch (err) {
  console.error('Errore nel salvataggio:', err);
}
```

### `create()`
Crea e salva uno o più documenti in un'unica operazione.

```javascript
// Crea un singolo documento
const user = await User.create({
  nome: 'Luigi Verdi',
  email: 'luigi@example.com'
});

// Crea più documenti
const users = await User.create([
  { nome: 'User1', email: 'user1@example.com' },
  { nome: 'User2', email: 'user2@example.com' }
]);
```

### `insertMany()`
Inserisce più documenti in un'unica operazione (più veloce di create per grandi quantità).

```javascript
const users = await User.insertMany([
  { nome: 'User1', email: 'user1@example.com' },
  { nome: 'User2', email: 'user2@example.com' },
  { nome: 'User3', email: 'user3@example.com' }
]);
```

---

## Metodi di Aggiornamento

### `updateOne()`
Aggiorna il primo documento che corrisponde ai criteri.

```javascript
const result = await User.updateOne(
  { email: 'mario@example.com' },
  { $set: { età: 31 } }
);

console.log(`Documenti modificati: ${result.modifiedCount}`);
```

### `updateMany()`
Aggiorna tutti i documenti che corrispondono ai criteri.

```javascript
const result = await User.updateMany(
  { attivo: false },
  { $set: { attivo: true } }
);

console.log(`${result.modifiedCount} utenti riattivati`);
```

### `findByIdAndUpdate()`
Trova un documento per ID e lo aggiorna.

```javascript
const user = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { $set: { nome: 'Nuovo Nome' } },
  { new: true } // Restituisce il documento aggiornato
);
```

### `findOneAndUpdate()`
Trova un documento e lo aggiorna.

```javascript
const user = await User.findOneAndUpdate(
  { email: 'mario@example.com' },
  { $set: { età: 32 } },
  { 
    new: true,           // Restituisce il documento aggiornato
    runValidators: true  // Esegue le validazioni dello schema
  }
);
```

### Operatori di Aggiornamento MongoDB

```javascript
// $set - Imposta un valore
await User.updateOne({ _id: id }, { $set: { nome: 'Nuovo' } });

// $inc - Incrementa un valore
await User.updateOne({ _id: id }, { $inc: { età: 1 } });

// $push - Aggiunge a un array
await User.updateOne({ _id: id }, { $push: { tags: 'nuovo-tag' } });

// $pull - Rimuove da un array
await User.updateOne({ _id: id }, { $pull: { tags: 'vecchio-tag' } });

// $addToSet - Aggiunge a un array solo se non esiste
await User.updateOne({ _id: id }, { $addToSet: { tags: 'tag-unico' } });

// $unset - Rimuove un campo
await User.updateOne({ _id: id }, { $unset: { campo: '' } });
```

---

## Metodi di Eliminazione

### `deleteOne()`
Elimina il primo documento che corrisponde ai criteri.

```javascript
const result = await User.deleteOne({ email: 'test@example.com' });
console.log(`Documenti eliminati: ${result.deletedCount}`);
```

### `deleteMany()`
Elimina tutti i documenti che corrispondono ai criteri.

```javascript
const result = await User.deleteMany({ attivo: false });
console.log(`${result.deletedCount} utenti eliminati`);
```

### `findByIdAndDelete()`
Trova un documento per ID e lo elimina.

```javascript
const user = await User.findByIdAndDelete('507f1f77bcf86cd799439011');
if (user) {
  console.log('Utente eliminato:', user.nome);
}
```

### `findOneAndDelete()`
Trova un documento e lo elimina.

```javascript
const user = await User.findOneAndDelete({ email: 'test@example.com' });
```

---

## Metodi Custom

### Instance Methods
Metodi che operano su singole istanze di documenti.

```javascript
const userSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  email: String
});

// Definisci un metodo custom
userSchema.methods.getNomeCompleto = function() {
  return `${this.nome} ${this.cognome}`;
};

userSchema.methods.inviaEmail = async function(messaggio) {
  console.log(`Invio email a ${this.email}: ${messaggio}`);
  // Logica per inviare email
};

const User = mongoose.model('User', userSchema);

// Utilizzo
const user = await User.findOne({ email: 'test@example.com' });
console.log(user.getNomeCompleto());
await user.inviaEmail('Benvenuto!');
```

### Static Methods
Metodi che operano sul modello stesso.

```javascript
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email });
};

userSchema.statics.findAttivi = function() {
  return this.find({ attivo: true });
};

// Utilizzo
const user = await User.findByEmail('test@example.com');
const utentiAttivi = await User.findAttivi();
```

### Query Helpers
Metodi che estendono le query.

```javascript
userSchema.query.byNome = function(nome) {
  return this.where({ nome: new RegExp(nome, 'i') });
};

// Utilizzo
const users = await User.find().byNome('mario').exec();
```

---

## Validazione

### Validatori Built-in

```javascript
const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    minlength: [3, 'Il nome deve essere di almeno 3 caratteri'],
    maxlength: [100, 'Il nome non può superare 100 caratteri'],
    trim: true
  },
  prezzo: {
    type: Number,
    required: true,
    min: [0, 'Il prezzo non può essere negativo'],
    max: 10000
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email non valida']
  },
  categoria: {
    type: String,
    enum: {
      values: ['elettronica', 'abbigliamento', 'libri'],
      message: '{VALUE} non è una categoria valida'
    }
  },
  disponibile: {
    type: Boolean,
    default: true
  }
});
```

### Validatori Custom

```javascript
const userSchema = new mongoose.Schema({
  età: {
    type: Number,
    validate: {
      validator: function(v) {
        return v >= 18;
      },
      message: 'Devi essere maggiorenne'
    }
  },
  password: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v);
      },
      message: 'La password deve contenere almeno 8 caratteri, una maiuscola e un numero'
    }
  }
});
```

### Middleware (Hooks)

```javascript
// Pre-save hook
userSchema.pre('save', async function(next) {
  // Esegui prima del salvataggio
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save hook
userSchema.post('save', function(doc, next) {
  console.log(`Utente ${doc.nome} salvato con successo`);
  next();
});

// Pre-remove hook
userSchema.pre('remove', async function(next) {
  // Pulisci dati correlati prima di eliminare
  await Post.deleteMany({ autore: this._id });
  next();
});
```

---

## Operatori di Query MongoDB

### Operatori di Confronto

```javascript
// $eq - Uguale
await User.find({ età: { $eq: 25 } });

// $ne - Diverso
await User.find({ età: { $ne: 25 } });

// $gt - Maggiore
await User.find({ età: { $gt: 18 } });

// $gte - Maggiore o uguale
await User.find({ età: { $gte: 18 } });

// $lt - Minore
await User.find({ età: { $lt: 65 } });

// $lte - Minore o uguale
await User.find({ età: { $lte: 65 } });

// $in - Presente in array
await User.find({ categoria: { $in: ['admin', 'moderatore'] } });

// $nin - Non presente in array
await User.find({ categoria: { $nin: ['bannato', 'sospeso'] } });
```

### Operatori Logici

```javascript
// $and
await User.find({
  $and: [
    { età: { $gte: 18 } },
    { attivo: true }
  ]
});

// $or
await User.find({
  $or: [
    { email: 'test@example.com' },
    { username: 'testuser' }
  ]
});

// $not
await User.find({ età: { $not: { $gte: 18 } } });

// $nor - Nessuna delle condizioni è vera
await User.find({
  $nor: [
    { attivo: false },
    { bannato: true }
  ]
});
```

### Operatori per Array

```javascript
// $all - Contiene tutti gli elementi
await User.find({ tags: { $all: ['javascript', 'nodejs'] } });

// $elemMatch - Almeno un elemento dell'array corrisponde
await User.find({
  ordini: {
    $elemMatch: { stato: 'completato', totale: { $gt: 100 } }
  }
});

// $size - Array con lunghezza specifica
await User.find({ tags: { $size: 3 } });
```

### Operatori per Stringhe

```javascript
// $regex - Espressione regolare
await User.find({ nome: { $regex: /^Mario/i } });

// Ricerca case-insensitive
await User.find({ nome: { $regex: 'mario', $options: 'i' } });
```

---

## Popolazione (Populate)

Utilizzato per referenziare documenti da altre collezioni.

```javascript
// Schema con riferimento
const postSchema = new mongoose.Schema({
  titolo: String,
  contenuto: String,
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Post = mongoose.model('Post', postSchema);

// Popola il campo autore
const post = await Post.findById(postId).populate('autore');
console.log(post.autore.nome); // Accedi ai dati dell'autore

// Popola solo alcuni campi
const post = await Post.findById(postId)
  .populate('autore', 'nome email');

// Popola campi multipli
const post = await Post.findById(postId)
  .populate('autore')
  .populate('commenti');

// Popola con condizioni
const post = await Post.findById(postId)
  .populate({
    path: 'commenti',
    match: { approvato: true },
    select: 'testo data',
    options: { sort: { data: -1 }, limit: 10 }
  });
```

---

## Best Practices

1. **Usa sempre try-catch** per gestire gli errori
2. **Valida i dati** sia lato client che lato server
3. **Usa indici** per campi frequentemente cercati
4. **Limita i risultati** delle query per evitare sovraccarichi
5. **Usa lean()** per query di sola lettura (più veloce)
6. **Evita callback**, usa async/await
7. **Chiudi le connessioni** quando l'app termina

```javascript
// Esempio completo con best practices
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password') // Escludi campi sensibili
      .lean(); // Più veloce per sola lettura
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});
```

---

## Risorse Utili

- [Documentazione ufficiale Mongoose](https://mongoosejs.com/docs/)
- [MongoDB Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)
