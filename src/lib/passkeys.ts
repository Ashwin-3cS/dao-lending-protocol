import { PasskeyArgType, extractPasskeyData } from '@safe-global/protocol-kit'
import { STORAGE_PASSKEY_LIST_KEY } from './constants'

import axios from 'axios'

/**
 * Create a passkey using WebAuthn API.
 * @returns {Promise<PasskeyArgType>} Passkey object with rawId and coordinates.
 * @throws {Error} If passkey creation fails.
 */
export async function createPasskey(): Promise<PasskeyArgType> {
  const displayName = 'Safe Owner' // This can be customized to match, for example, a user name.
  // Generate a passkey credential using WebAuthn API
  const passkeyCredential = await navigator.credentials.create({
    publicKey: {
      pubKeyCredParams: [
        {
          // ECDSA w/ SHA-256: https://datatracker.ietf.org/doc/html/rfc8152#section-8.1
          alg: -7,
          type: 'public-key'
        }
      ],
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: {
        name: 'Safe SmartAccount'
      },
      user: {
        displayName,
        id: crypto.getRandomValues(new Uint8Array(32)),
        name: displayName
      },
      timeout: 60_000,
      attestation: 'none'
    }
  })

  if (!passkeyCredential) {
    throw Error('Passkey creation failed: No credential was returned.')
  }

  const passkey = await extractPasskeyData(passkeyCredential)
  console.log('Created Passkey:', passkey)

  return passkey
}

/**
 * Store passkey in local storage.
 * @param {PasskeyArgType} passkey - Passkey object with rawId and coordinates.
 */
export function storePasskeyInLocalStorage(passkey: PasskeyArgType) {
  const passkeys = loadPasskeysFromLocalStorage()

  passkeys.push(passkey)

  localStorage.setItem(STORAGE_PASSKEY_LIST_KEY, JSON.stringify(passkeys))
}

/**
 * Load passkeys from local storage.
 * @returns {PasskeyArgType[]} List of passkeys.
 */
export function loadPasskeysFromLocalStorage(): PasskeyArgType[] {
  const passkeysStored = localStorage.getItem(STORAGE_PASSKEY_LIST_KEY)

  const passkeyIds = passkeysStored ? JSON.parse(passkeysStored) : []

  return passkeyIds
}
export async function loadPasskeysFromDB(email: string, password: string): Promise<PasskeyArgType[]> {
  try {
    const response = await axios.get(`/api/user/getUserPassKey/${email}`, {
      params: {
        password
      }
    });
    return response.data.passkeys;
  } catch (error) {
    console.error('Error loading passkeys from DB:', error);
    return [];
  }
}


/**
 * Get passkey object from local storage.
 * @param {string} passkeyRawId - Raw ID of the passkey.
 * @returns {PasskeyArgType} Passkey object.
 */
export async function getPasskeyFromRawId(passkeyRawId: string,email: string , password: string): Promise<PasskeyArgType | undefined> {
  // const passkeys = loadPasskeysFromLocalStorage()
  const passkeys =await loadPasskeysFromDB(email,password);
  const passkey = passkeys.find((passkey:any) => passkey.rawId === passkeyRawId)!

  return passkey
}
