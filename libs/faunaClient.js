import axios from "axios";
const faunadb = require('faunadb')

const client = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
})

const q = faunadb.query

const graphqlReq = async (query) => {
  console.log(query)
  const arg = {
    method: "POST",
    data: {
      query,
    },
  };

  const a = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
    },
  })
  const r = await a(arg);

  if (r.data.errors) {
    console.log(r.data.errors[0].message);
  }
  return r;
}

export const createMultisig = async (multisig) => {
  let multisigByAddressMutation = ''

  multisig.components.map((address, index) => {
    const mutation = `
      alias${index}:
        createMultisigByAddress(
          data: { 
            address: "${multisig.address}", 
            createFrom: "${address}" 
          }
        ) {
          address
        }`
    multisigByAddressMutation = multisigByAddressMutation + mutation + '\n'
  })

  const date = new Date()

  const query = `
    mutation {
      createMultisig(data: {
        address: "${multisig.address}",
        pubkeyJSON: ${JSON.stringify(multisig.pubkeyJSON)},
        prefix: "${multisig.prefix}"
        createdOn: "${date.toISOString()}"
      }) {
        _id
        address
      }

      ${multisigByAddressMutation}
    }`;
  return await graphqlReq(query);
}

export const getMultisigByAddress = async (address) => {
  const query = `
    query {
      getMultisig(address: "${address.address}") {
        address
        pubkeyJSON
        prefix
        createdOn
      }
    }`;
  return await graphqlReq(query);
}

export const getMultisigOfAddress = async (address) => {
  const query = `
    query{
      getAllMultisigByAddress(
          createFrom: "${address.address}"
      ) {
          data {
            address
          }
      }
    }`;
  return await graphqlReq(query);
}

export const createTransaction = async (transaction) => {
  const date = new Date()
  console.log(transaction)

  const query = `
    mutation {
      createTransaction(
        data: {
          createBy: "${transaction.createBy}",
          dataJSON: ${JSON.stringify(transaction.dataJSON)},
          status: "PENDING"
          createdOn: "${date.toISOString()}"
        }) {
          _id
        }
    }`;
  console.log(query)

  return await graphqlReq(query);
}

export const getTransaction = async (id) => {
  const query = `
    query {
      findTransactionByID(id: "${id}") {
        _id
        createBy
        txHash
        signatures {
          data {
            _id
            address
            signature
            bodyBytes
            accountNumber
            sequence
          }
        }
        dataJSON
      }
    }`;
  return await graphqlReq(query);
}

export const createSignature = async (signature, transactionId) => {
  const query = `
    mutation {
      createSignature(data: {
        transaction: {connect: ${transactionId}}, 
        bodyBytes: "${signature.bodyBytes}",
        signature: "${signature.signature}",
        address: "${signature.address}",
        accountNumber: ${signature.accountNumber},
        sequence: ${signature.sequence}
      }) {
        _id
        address
        signature
        accountNumber
        sequence
        bodyBytes
      }
    }`;
  return await graphqlReq(query);
};

export const updateSignature = async (signature, transactionId) => {
  const query = `
    mutation {
      updateSignature(id: "${signature.id}",
         data: { 
          transaction: {connect: ${transactionId}}, 
          bodyBytes: "${signature.bodyBytes}",
          signature: "${signature.signature}",
          address: "${signature.address}",
          accountNumber: ${signature.accountNumber},
          sequence: ${signature.sequence}
        }) {
          _id
          address
          signature
          bodyBytes
          accountNumber
          sequence
        }
    }`;
  return await graphqlReq(query);
};

export const deleteSignature = async (id) => {
  const query = `
    mutation {
      deleteSignature(id: "${id}") {
          _id
        }
      }
    }`;
  return await graphqlReq(query);
}

export const updateTransaction = async (txHash, transactionID, multisigID) => {
  const query = `
    mutation {
      updateTransaction(id: ${transactionID}, 
        data: {
          txHash: "${txHash}",
          status: "FINISHED",
          createBy: "${multisigID}"
        }) {
        _id
        dataJSON
        txHash
        signatures {
          data {
            _id
            address
            signature
            bodyBytes
            accountNumber
            sequence
          }
        }
      }
    }`;
  return await graphqlReq(query);
}

export const deleteTransaction = async (id) => {
  const query = `
    mutation {
      deleteTransaction(id: "${id}") {
          _id
        }
    }
  }`;
  return await graphqlReq(query);
}


export const getTransactionsOfMultisig = async (multisig) => {
  const query = `
    query {
      getTxByMultisig(createBy: "${multisig}"){
        data{
          _id
          createdOn
          dataJSON
          status
          txHash
        }
      }
    }`;
  return await graphqlReq(query);
}
