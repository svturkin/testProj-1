const createCollections = async (db) => {
  await db.createCollection('users', {
    validator: {
      $and: [
        { phone: { $type: 'string' } },
        { name: { $type: 'string' } }
      ],
    },
    validationAction: 'error',
    validationLevel: 'strict',
  })
  await db.collection('users').insertMany([
    {
      phone: '+79225485423',
      name: 'Василий'
    },
    {
      phone: '+79197486955',
      name: 'Александр'
    },
    {
      phone: '+79179232323',
      name: 'Дмитрий'
    }
  ])
  await db.createCollection('doctors', {
    validator: {
      $and: [
        { name: { $type: 'string' } },
        { spec: { $type: 'string' } },
        { slots: { $type: 'array' } }
      ],
    },
    validationAction: 'error',
    validationLevel: 'strict',
  })
  await db.collection('doctors').insertMany([
    {
      name: 'Светлана',
      spec: 'Терапевт',
      slots: [{ datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }, { datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }]
    },
    {
      name: 'Анна',
      spec: 'Невролог',
      slots: [{ datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }, { datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }]
    },
    {
      name: 'Мария',
      spec: 'Аллерголог',
      slots: [{ datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }, { datetime: new Date('2021-06-06T09:00').toLocaleString(), reservedBy: null }]
    }
  ])
}

module.exports = {
  async up(db) {
    try {
      await createCollections(db)
    } catch (err) {
      throw err
    }
  },

  async down(db) {
    try {
      await db.dropCollection('users')
      await db.dropCollection('doctors')
    } catch (err) {
      throw err
    }
  }
};
