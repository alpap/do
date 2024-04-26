import {expect, test} from '@oclif/test'
import fs from 'fs'
import sortKeys from 'sort-keys'
const demo_file = {
  result: [
    {
      status: 'active',
      name: {
        first: 'Autumn',
        middle: 'Finley',
        last: 'Reichert',
      },
      location: {
        street: '63083 Marlon Grove',
        city: 'Port Yessenia',
        state: 'Texas',
        country: 'Belgium',
        zip: '20256-2494',
        coordinates: {
          latitude: -7.3198,
          longitude: -179.3083,
        },
      },
      uuid: 'c12b4847-7001-4bdc-8307-5d9c61c0ef52',
      objectId: '66215612756c94cae8897111',
    },
    {
      status: 'active',
      name: {
        first: 'Buck',
        middle: 'Leslie',
        last: 'Olson',
      },
      username: 'Buck-Olson',
      password: 'delDR7BcGZU59q7',
      emails: ['Bertrand.Buckridge@example.com', 'Gordon_Schamberger@gmail.com'],
      phoneNumber: '(601) 739-5108',
      location: {
        street: '240 Domenica Rest',
        city: 'Karineburgh',
        state: 'Washington',
        country: 'Sint Maarten',
        zip: '49576',
        coordinates: {
          latitude: -18.5169,
          longitude: -83.8627,
        },
      },
      website: 'https://wan-pounding.com',
      domain: 'cruel-altar.info',
      job: {
        title: 'Product Group Designer',
        descriptor: 'Legacy',
        area: 'Infrastructure',
        type: 'Architect',
        company: 'Nader LLC',
      },
      creditCard: {
        number: '3491-673674-09288',
        cvv: '733',
        issuer: 'discover',
      },
      uuid: '9dd56028-6512-49ac-8c67-c9c5d0017a0c',
      objectId: '66215612756c94cae8897112',
    },
  ],
  a: 'b',
}

const sorted = sortKeys(demo_file)

const sorted_deep = sortKeys(demo_file, {deep: true})

describe('json sort', () => {
  beforeEach(async () => {
    fs.mkdirSync('mocks', {recursive: true})
    fs.writeFileSync('mocks/file.json', JSON.stringify(demo_file, null, 2))
    fs.writeFileSync('mocks/file2.json', JSON.stringify(demo_file, null, 2))
    fs.writeFileSync('mocks/file3.json', JSON.stringify(demo_file, null, 2))
    fs.writeFileSync('mocks/file4.json', JSON.stringify(demo_file, null, 2))
  })

  afterEach(async () => {
    fs.existsSync('mocks') && fs.rmSync('./mocks', {recursive: true, force: true})
  })

  test
    .stdout()
    .command(['json sort', './mocks/file.json'])
    .it('runs json sort single', (ctx) => {
      const file = fs.readFileSync('mocks/file.json', 'utf8')
      expect(file).to.equal(JSON.stringify(sorted, null, 2))
    })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks/file2.json', '--deep'])
  //   .it('runs json sort single deep', (ctx) => {
  //     const file = fs.readFileSync('mocks/file2.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted_deep, null, 2))
  //   })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks/file2.json', '--deep', '--verbose'])
  //   .it('runs json sort single deep verbose', (ctx) => {
  //     const file = fs.readFileSync('mocks/file2.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted_deep, null, 2))
  //   })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks/file2.json', '--output=./mocks/banana.json'])
  //   .it('runs json sort single output', (ctx) => {
  //     const file = fs.readFileSync('./mocks/banana.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted, null, 2))
  //   })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks'])
  //   .it('runs json sort multiple', (ctx) => {
  //     const file = fs.readFileSync('mocks/file.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted, null, 2))
  //     const file2 = fs.readFileSync('mocks/file2.json', 'utf8')
  //     expect(file2).to.equal(JSON.stringify(sorted, null, 2))
  //     const file3 = fs.readFileSync('mocks/file3.json', 'utf8')
  //     expect(file3).to.equal(JSON.stringify(sorted, null, 2))
  //     const file4 = fs.readFileSync('mocks/file4.json', 'utf8')
  //     expect(file4).to.equal(JSON.stringify(sorted, null, 2))
  //   })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks', '--deep'])
  //   .it('runs json sort multiple deep', (ctx) => {
  //     const file = fs.readFileSync('mocks/file.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file2 = fs.readFileSync('mocks/file2.json', 'utf8')
  //     expect(file2).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file3 = fs.readFileSync('mocks/file3.json', 'utf8')
  //     expect(file3).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file4 = fs.readFileSync('mocks/file4.json', 'utf8')
  //     expect(file4).to.equal(JSON.stringify(sorted_deep, null, 2))
  //   })

  // test
  //   .stdout()
  //   .command(['json sort', './mocks', '--deep', '--prepend=sorted'])
  //   .it('runs json sort multiple deep prepend', (ctx) => {
  //     const file = fs.readFileSync('mocks/sorted-file.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file2 = fs.readFileSync('mocks/sorted-file2.json', 'utf8')
  //     expect(file2).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file3 = fs.readFileSync('mocks/sorted-file3.json', 'utf8')
  //     expect(file3).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file4 = fs.readFileSync('mocks/sorted-file4.json', 'utf8')
  //     expect(file4).to.equal(JSON.stringify(sorted_deep, null, 2))
  //   })
  // test
  //   .stdout()
  //   .command(['json sort', './mocks', '--deep', '-o ./mocks/sorted'])
  //   .it('runs json sort multiple deep output', (ctx) => {
  //     const file = fs.readFileSync('mocks/sorted/file.json', 'utf8')
  //     expect(file).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file2 = fs.readFileSync('mocks/sorted/file2.json', 'utf8')
  //     expect(file2).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file3 = fs.readFileSync('mocks/sorted/file3.json', 'utf8')
  //     expect(file3).to.equal(JSON.stringify(sorted_deep, null, 2))
  //     const file4 = fs.readFileSync('mocks/sorted/file4.json', 'utf8')
  //     expect(file4).to.equal(JSON.stringify(sorted_deep, null, 2))
  //   })
})
