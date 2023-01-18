import "react-chat-elements/dist/main.css";
import Chapter from "./pages/Chapter.js";
import Landing from "./pages/Landing.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production") return;
		const script = document.createElement("script");

		script.src = "https://umani.api.route.run/umami.js";
		script.async = true;
		script["data-website-id"] = "68db3bde-1280-4154-9891-c6c2c8d0d080";
		script.defer = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Landing />} />
				<Route path="/chapter/:id" element={<Chapter />} />
			</Routes>
		</Router>
	);
};

export default App;
