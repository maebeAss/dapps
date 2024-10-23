import { ABI } from "./abi";
import { ethers } from "ethers";
import './App.css'
import { Contract } from "ethers";

function App() {

  const address = "0x0072eEABf16d2E75adaE897875a89857DEB9F8d8"
  const rpc = "https://1rpc.io/matic";


  const handleClick = async() => {
    console.log('click');
    const trust = await getTrustWalletInjectedProvider();
    console.log(trust);

    try {
      const account = await trust.request({
        method: "eth_requestAccounts",
      });
    
      console.log(account); // => ['0x...']
    } catch (e) {
      if (e.code === 4001) {
        console.error("User denied connection.");
      }
    }
    // const listen = listenForTrustWalletInitialized();
    // console.log(listen);
  }


   async function getTrustWalletInjectedProvider(
    { timeout } = { timeout: 3000 }
  ) {
    const provider = getTrustWalletFromWindow();
  
    if (provider) {
      return provider;
    }
  
    return listenForTrustWalletInitialized({ timeout });
  }
  
  async function listenForTrustWalletInitialized(
    { timeout } = { timeout: 3000 }
  ) {
    return new Promise((resolve) => {
      const handleInitialization = () => {
        resolve(getTrustWalletFromWindow());
      };
  
      window.addEventListener("trustwallet#initialized", handleInitialization, {
        once: true,
      });
  
      setTimeout(() => {
        window.removeEventListener(
          "trustwallet#initialized",
          handleInitialization,
          { once: true }
        );
        resolve(null);
      }, timeout);
    });
  }
  
  function getTrustWalletFromWindow() {
    const isTrustWallet = (ethereum) => {
      // Identify if Trust Wallet injected provider is present.
      const trustWallet = !!ethereum.isTrust;
  
      return trustWallet;
    };
  
    const injectedProviderExist =
      typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  
    // No injected providers exist.
    if (!injectedProviderExist) {
      return null;
    }
  
    // Trust Wallet was injected into window.ethereum.
    if (isTrustWallet(window.ethereum)) {
      return window.ethereum;
    }
  
    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array.
    if (window.ethereum?.providers) {
      // ethereum.providers array is a non-standard way to
      // preserve multiple injected providers. Eventually, EIP-5749
      // will become a living standard and we will have to update this.
      return window.ethereum.providers.find(isTrustWallet) ?? null;
    }
  
    // Trust Wallet injected provider is available in the global scope.
    // There are cases that some cases injected providers can replace window.ethereum
    // without updating the ethereum.providers array. To prevent issues where
    // the TW connector does not recognize the provider when TW extension is installed,
    // we begin our checks by relying on TW's global object.
    return window["trustwallet"] ?? null;
  }

  const connectContract = async () => {
    const provider = await getTrustWalletInjectedProvider();
    const ethersProvider = new ethers.BrowserProvider (provider);

    const signer = await ethersProvider.getSigner();


    const contract = new ethers.Contract(
      address,
      ABI,
      signer
    )

    const character = await contract.character();
    console.log(character);
    console.log(contract);

    const Hit = await contract.Hit(100);
    console.log(Hit);
  }

  return (
    <>
      <button onClick={handleClick}>
        aboba
      </button>

      <button onClick={connectContract}>
        contract connect
      </button>
    </>
  )
}

export default App