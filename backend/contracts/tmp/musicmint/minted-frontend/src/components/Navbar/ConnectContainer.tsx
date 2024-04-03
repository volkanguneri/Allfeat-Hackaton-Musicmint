import { useCallback, useEffect, useState } from "react";
import { useWallets } from "@/contexts/Wallets";
import { Account } from "@polkadot-onboard/core";
import { formatAccount } from "@/utils/account";
import { ToastContainer, toast } from "react-toastify";
import DropDown from "./DropDown";

const ConnectContainer = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  
  const { wallet } = useWallets();
  const Msg = ({}) => (
    <div>
      <img
        src="/assets/image/icon/ALLFEAT_logo+points.png"
        style={{ height: "25px", width: "25px" }}
      ></img>
      <a target="_blank" href="https://polkadot.js.org/extension/">
        No wallet found. Please press here to install Allfeat wallet.
      </a>
    </div>
  );
  const notify = () => toast(<Msg />);
  
  const walletClickHandler = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.connect();
        let accounts = await wallet.getAccounts();
        accounts.map((account) => {
          account.address = formatAccount(account.address);
        });
        setAccounts(accounts);
        const savedAccount = localStorage.getItem("currentAccount");
        const parsedAccount =
          savedAccount && savedAccount != "null"
            ? JSON.parse(savedAccount)
            : accounts[0].address;
        setCurrentAccount(parsedAccount);
        localStorage.setItem("currentAccount", JSON.stringify(parsedAccount));
      } catch (error) {}
    }
  }, [wallet]);

  useEffect(() => {
    walletClickHandler()
  }, [walletClickHandler])


  return (
    <div>
      {wallet ? (
        <div>
          {accounts.length ? (
            <DropDown
              accountArray={accounts}
              current={currentAccount}
              setAccounts={setAccounts}
            />
          ) : (
            <button
              onClick={walletClickHandler}
              className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
            >
              <small>
                <span className="me-1">
                  <img
                    src="/assets/image/icon/ALLFEAT_logo+points.png"
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                </span>
                Connect Wallet
              </small>
            </button>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={notify}
            className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
          >
            <small>
              <span className="me-1">
                <img
                  src="/assets/image/icon/ALLFEAT_logo+points.png"
                  style={{ height: "20px", width: "20px" }}
                ></img>
              </span>
              Connect Wallet
            </small>
          </button>
          <ToastContainer
            position="top-right"
            newestOnTop={true}
            autoClose={5000}
            pauseOnHover
            pauseOnFocusLoss
            draggable
          />
        </>
      )}
    </div>
  );
};

export default ConnectContainer;
