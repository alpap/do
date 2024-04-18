import {expect, test} from '@oclif/test'
import fs from 'fs'
const demo_file = {
  result: [
    {
      status: 'active',
      name: {
        first: 'Autumn',
        middle: 'Finley',
        last: 'Reichert',
      },
      username: 'Autumn-Reichert',
      password: 'ZiAU9h0q1Y2CDS1',
      emails: [
        'Landen_Johnston@gmail.com',
        'Kyleigh98@gmail.com',
        'Kyleigh98@gmail.com',
        'Kyleigh98@gmail.com',
        'Kyleigh98@gmail.com',
        'banana@namsd.ds',
      ],
      phoneNumber: '212.618.8842 x59933',
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
      website: 'https://neat-alder.biz',
      domain: 'scented-letter.name',
      job: {
        title: 'Principal Directives Officer',
        descriptor: 'Legacy',
        area: 'Identity',
        type: 'Specialist',
        company: 'Johnston, Ward and Bergnaum',
      },
      creditCard: {
        number: '3014-387387-1711',
        cvv: '229',
        issuer: 'discover',
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

describe('json sort', () => {
  beforeEach(async () => {
    fs.mkdirSync('mocks', {recursive: true})
    fs.writeFileSync('mocks/file.json', JSON.stringify(demo_file, null, 2))
  })

  //   afterEach(async () => {
  //     fs.existsSync('mocks') && fs.rmSync('./mocks', {recursive: true, force: true})
  //   })

  test
    .stdout()
    .command(['json sort', './mocks/file.json'])
    .it('runs json sort single', (ctx) => {
      expect(ctx.stdout).to.contain('hello friend from oclif!')
    })

  //   test
  //     .stdout()
  //     .command(['json', 'sort', '.'])
  //     .it('runs json sort multiple', (ctx) => {
  //       expect(ctx.stdout).to.contain('hello friend from oclif!')
  //     })
})
