import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '~/pages/Home';
// import Login from '~/pages/Login';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefautLayout';
// import DefaultLayout from '/components/Layout/DefautLayout';
import { Fragment } from 'react';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} /> */}
                    {publicRoutes.map((route,index)=>{
                        const Layout = route.layout ===null ? Fragment : DefaultLayout;
                        const Page = route.component;
                        return (
                            <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page/>
                                </Layout>
                            }
                            />
                        )
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
