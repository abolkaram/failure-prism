'use client';
import { createAccount, createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

export const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '') as `0x${string}`;
export const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || 'https://explorer-studio.genlayer.com';
const endpoint = 'https://studio.genlayer.com/api';
const reader: any = createClient({ chain: studionet, endpoint, account: createAccount() });
let signer: any;

export async function connectWallet() {
  const provider: any = (window as any).ethereum;
  if (!provider) throw new Error('Install a browser wallet to write to StudioNet.');
  const [address] = await provider.request({ method: 'eth_requestAccounts' });
  signer = createClient({ chain: studionet, endpoint, account: address, provider });
  return address as string;
}

export async function readContract(name: string, args: any[] = []) {
  if (!CONTRACT) throw new Error('Contract deployment is not configured yet.');
  return reader.readContract({ address: CONTRACT, functionName: name, args });
}

export async function writeContract(name: string, args: any[] = [], onStatus?: (value: string) => void) {
  if (!signer) throw new Error('Connect a wallet before sending a transaction.');
  if (!CONTRACT) throw new Error('Contract deployment is not configured yet.');
  onStatus?.('SUBMITTED');
  const hash = await signer.writeContract({ address: CONTRACT, functionName: name, args, value: 0n });
  onStatus?.('CONSENSUS');
  await signer.waitForTransactionReceipt({ hash, status: 'FINALIZED', retries: 180, interval: 5000 });
  onStatus?.('FINALIZED');
  return hash as string;
}
