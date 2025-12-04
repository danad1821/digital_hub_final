import { RxHamburgerMenu } from "react-icons/rx";
export default function Header() {
  return (
    <header className="py-2 flex items-center bg-white px-0 sticky top-0 z-50 shadow-md">
      <nav className="flex flex-nowrap w-full custom-container">
        <ul className="list-none w-full">
          <div className="flex items-center justify-between w-full ">
            <li className="text-2xl font-medium">Alta Maritime</li>
            <button className="bg-white border-none">
              <RxHamburgerMenu className="text-2xl font-bold bg-white" />
            </button>
          </div>
          <div className="hidden">
            <li>Partners & Agents</li>
            <li>Contact us</li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
