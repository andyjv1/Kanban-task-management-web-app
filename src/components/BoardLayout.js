import { Outlet, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    selectBoardById,
    useGetBoardsQuery,
} from "../features/boards/boardsApiSlice";
import NotFound from "./NotFound";
const BoardLayout = ({ sidebarOpen, setSidebarOpen }) => {
    const { id } = useParams();

    // Get individual board data with id
    const board = useSelector((state) => selectBoardById(state, id));
    const rootElement = document.getElementById("root");
    const { isLoading, isError } = useGetBoardsQuery();

    const [width, setWidth] = useState(window.innerWidth);
    const [dark, setDark] = useState(false);

    // To get the width of the page
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    // Make the page overflow if the board has columns
    board?.columns.length
        ? (rootElement.style.overflow = null)
        : (rootElement.style.overflow = "hidden");

    let content;

    if (isLoading && !isError) {
        content = <p>Loading...</p>;
    }
    if ((!isLoading && isError) || (!isLoading && !isError && !board)) {
        content = (
            <NotFound
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
                dark={dark}
            />
        );
    }
    if ((!isLoading && !isError && board)
        || (!isLoading && !isError && !board && window.location.pathname === "/")
        || (!isLoading && !isError && !board && window.location.pathname === "/createboard")) {
        content = (
            <Outlet
                context={{
                    board,
                    id,
                    width,
                    setSidebarOpen,
                    sidebarOpen,
                    dark,
                }}
            />
        );
    }

    return (
        <>
            <Header
                id={id}
                board={board}
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
                disabled={
                    id === undefined || board?.columns.length === 0 ? true : false
                }
                width={width}
                dark={dark}
            />
            <main
                className={`main-container ${sidebarOpen ? "active" : "inactive"} ${dark ? "very-dark-background" : "very-light-background"
                    }`}
            >
                <div
                    className="overlay2"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ height: sidebarOpen && width < 546 ? "100%" : "0px" }}
                ></div>
                <SideBar
                    width={width}
                    dark={dark}
                    sidebarOpen={sidebarOpen}
                    setDark={setDark}
                    setSidebarOpen={setSidebarOpen}
                    id={id}
                />
                {content}
            </main>
        </>
    );
};

export default BoardLayout;