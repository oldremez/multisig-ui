## This is a multisig UI.

# Getting Started

Firstly, go to Faunadb (https://fauna.com/) create a database and import the schema from the `schema.graphql` file.

Secondly, get the Secret key from faunadb. Create a `.env.local` file in the root directory and add the secret key. If
you are to use non-Classic region (e.g. EU or US), add the endpoint as well. See more info in
[FaunaDB docs](https://docs.fauna.com/fauna/current/api/graphql/endpoints).

Thirdly, add the host directory in the `.env.local` file

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Example .env.local file

```
NEXT_PUBLIC_FAUNADB_SECRET=kfsdafsda89f8ffdf-43349
NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT=https://graphql.fauna.com/graphql
NEXT_PUBLIC_HOST=http://localhost:3000/
```

# Supported chains:

1. Osmosis
2. Gaia (cosmoshub)
3. Juno
4. Akash
5. Emoney
6. Stargaze
7. Kava
8. Rengen
9. Omniflix
10. Cheqd
11. Bitcanna
12. Gravity bridge
13. Pylon
14. Stride
15. Migaloo ( White Whale )
16. Neutron

Will add more chains in the future


