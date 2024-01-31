import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const TokenAirdropPage = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const _web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                setWeb3(_web3);
            }
        };

        initWeb3();
    }, []);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (web3) {
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = TokenAirdropContract.networks[networkId];
                const contract = new web3.eth.Contract(
                    TokenAirdropContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setContract(contract);
            }
        };

        loadBlockchainData();
    }, [web3]);

    const executeAirdrop = async () => {
        try {
            await contract.methods.executeAirdrop(recipients, amount).send({ from: accounts[0] });
            console.log('Airdrop successful');
        } catch (error) {
            console.error('Airdrop failed', error);
        }
    };

    return (
        <div>
            <h1>Token Airdrop</h1>
            <p>Connected Account: {accounts[0]}</p>
            <input type="text" placeholder="Token Address" onChange={(e) => setTokenAddress(e.target.value)} />
            <button onClick={() => contract.methods.setAirdropToken(tokenAddress).send({ from: accounts[0] })}>
                Set Token
            </button>
            <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder="Recipient Address" onChange={(e) => setRecipients([e.target.value])} />
            <button onClick={executeAirdrop}>Execute Airdrop</button>
        </div>
    );
};

export default TokenAirdropPage;
