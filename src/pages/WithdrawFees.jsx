import React, { useState, useEffect } from 'react';
import * as ethers from 'ethers';
import { DRAGO_GAME_ABI, DRAGO_GAME_ADDRESS } from '../contracts/dragoGameContract';

export default function WithdrawFees() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [ownerCheckResult, setOwnerCheckResult] = useState('');
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerInstance = await provider.getSigner();
      setSigner(signerInstance);

      const address = await signerInstance.getAddress();
      setAccount(address);

      const dragoGame = new ethers.Contract(DRAGO_GAME_ADDRESS, DRAGO_GAME_ABI, signerInstance);
      setContract(dragoGame);

      const contractBalance = await provider.getBalance(DRAGO_GAME_ADDRESS);
      setBalance(ethers.formatEther(contractBalance));

      const owner = await dragoGame.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());

      setIsConnected(true);
    } catch (err) {
      console.error('Failed to connect:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0 && isConnected) {
        setAccount(accounts[0]);
        connectWallet(); // Reconnect with the new account
      } else {
        setIsConnected(false);
        setAccount('');
        setSigner(null);
        setContract(null);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isConnected]);

  const checkOwner = async () => {
    if (contract && signer) {
      try {
        const ownerAddress = await contract.owner();
        console.log("Contract owner:", ownerAddress);
        const currentAddress = await signer.getAddress();
        console.log("Current address:", currentAddress);
        if (ownerAddress.toLowerCase() === currentAddress.toLowerCase()) {
          setOwnerCheckResult("You are the contract owner");
        } else {
          setOwnerCheckResult("You are not the contract owner");
        }
      } catch (error) {
        console.error("Error checking owner:", error);
        setOwnerCheckResult("Error checking ownership");
      }
    } else {
      setOwnerCheckResult("Contract or signer not initialized");
    }
  };

  const handleWithdraw = async () => {
    if (!contract || !isOwner) return;
    setIsWithdrawing(true);
    try {
      const tx = await contract.withdrawFees();
      await tx.wait();
      alert('Fees withdrawn successfully!');
      // Refresh balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newBalance = await provider.getBalance(DRAGO_GAME_ADDRESS);
      setBalance(ethers.utils.formatEther(newBalance));
    } catch (error) {
      console.error('Failed to withdraw:', error);
      alert('Failed to withdraw fees. See console for details.');
    }
    setIsWithdrawing(false);
  };

  const handleCloseEvent = async () => {
    if (!contract || !isOwner) return;
    setIsClosingEvent(true);
    try {
      const tx = await contract.adminCloseEvent();
      await tx.wait();
      alert('Event closed successfully!');
      // Should close the event no matter the event state, finished or not for testing purposes
      // ! This is not recommended for production or perhaps it is??? Have not decided yet :)
    } catch (error) {
      console.error('Failed to close event:', error);
      alert('Failed to close event. See console for details.');
    }
    setIsClosingEvent(false);
  };

  return (
    <div className="withdraw-fees-container">
      <h2>Admin Controls</h2>
      {isConnected ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Contract Balance: {balance} ETH</p>
          {isOwner ? (
            <>
              <button onClick={handleWithdraw} disabled={isWithdrawing} className="withdraw-button">
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw Fees'}
              </button>
              <button onClick={handleCloseEvent} disabled={isClosingEvent} className="close-event-button">
                {isClosingEvent ? 'Closing Event...' : 'Close Current Event'}
              </button>
            </>
          ) : (
            <p>You are not the contract owner.</p>
          )}
          <button onClick={checkOwner} className="check-owner-button">
            Check Owner
          </button>
          {ownerCheckResult && <p>{ownerCheckResult}</p>}
        </>
      ) : (
        <button onClick={connectWallet} disabled={isConnecting} className="connect-button">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}