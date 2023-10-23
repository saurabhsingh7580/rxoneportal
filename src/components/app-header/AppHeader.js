import ModeSection from "./ModeSection";
import UserNav from "./UserNav";

function AppHeader() {
	return (
		<header className="w-100">
			{process.env.REACT_APP_ENV !== "production" ? <ModeSection /> : null}
			<UserNav />
		</header>
	);
}

export default AppHeader;
