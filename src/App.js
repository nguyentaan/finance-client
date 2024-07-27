import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefautLayout';
// import DefaultLayout from '/components/Layout/DefautLayout';
import { Fragment } from 'react';
// import store from './reducers/store';
// import axiosInterceptor from './axios/axiosInterceptor';

function App() {
    // axiosInterceptor(store);

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
