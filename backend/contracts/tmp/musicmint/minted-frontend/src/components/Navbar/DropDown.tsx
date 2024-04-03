import { useEffect, useState } from "react";
import { Account } from "@polkadot-onboard/core";
import Identicon from "@polkadot/react-identicon";
import Link from "next/link";
import { beatifyAddress } from "@/utils/account";

interface ChildProps {
  accountArray: Account[];
  current: string | null;
  setAccounts: (accounts: any[]) => void;
}

const DropDown = (props: ChildProps) => {
  const [accounts, setAccounts] = useState<Account[]>(props.accountArray);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  useEffect(() => {
    setAccounts(props.accountArray);
    setCurrentAccount(props.current);
  }, [props.accountArray, props.current]);

  const selectAddress = (address: Account) => {
    setCurrentAccount(address.address);
    localStorage.setItem("currentAccount", JSON.stringify(address.address));
  };

  const walletDisConnect = () => {
    setAccounts([]);
    props.setAccounts([]);
    setCurrentAccount(null);
    localStorage.setItem("currentAccount", "null");
  };

  return (
    <div>
      <>
        <div className="btn-group">
          <div
            className="dropdown-toggle mousePointer"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Identicon
              value={currentAccount}
              size={32}
              theme="polkadot"
              className="pe-1"
            />
            {beatifyAddress(currentAccount)}
          </div>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-end mousePointer wallet-connect">
            {accounts.map((account: Account) => (
              <li key={account.address} onClick={() => selectAddress(account)}>
                <div className="dropdown-item d-flex">
                  <Identicon
                    value={account.address}
                    size={32}
                    theme="polkadot"
                    className="pe-1"
                  />
                  <p className="ps-1">{beatifyAddress(account.address)}</p>
                </div>
              </li>
            ))}
            <li>
              <div className="dropdown-item d-flex">
                <Link href="/profile" className="d-flex">
                  <img
                    src="/assets/image/icon/my-account.svg"
                    alt="my-account"
                  />
                  <p className="ps-1">My Account</p>
                </Link>
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                <Link href="/album" className="d-flex">
                  <img src="/assets/image/icon/my-nft.svg" alt="my-nft" />
                  <p className="ps-1">My Albums</p>
                </Link>
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                <Link href="/admins" className="d-flex">
                  <img
                    src="/assets/image/icon/my-account.svg"
                    alt="my-account"
                  />
                  <p className="ps-1">Admin Dashboard</p>
                </Link>
              </div>
            </li>
            <li>
              <div className="dropdown-item d-flex">
                <img src="/assets/image/icon/my-offer.svg" alt="my-offer" />
                <p className="ps-1">My Offer/Bid</p>
              </div>
            </li>
            <li>
              <div className="dropdown-item d-flex">
                <img src="/assets/image/icon/history.svg" alt="history" />
                <p className="ps-1">History</p>
              </div>
            </li>
            <li>
              <div className="dropdown-item d-flex">
                <img src="/assets/image/icon/my-nft.svg" alt="my-nft" />
                <p className="ps-1">My NFTs</p>
              </div>
            </li>

            <li>
              <div
                onClick={() => walletDisConnect()}
                className="dropdown-item d-flex"
              >
                <img src="/assets/image/icon/disconnect.svg" alt="disconnect" />
                <p className="ps-1"> Disconnect</p>
              </div>
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default DropDown;
