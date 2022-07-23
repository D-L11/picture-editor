import React from 'react'
import { Layout } from 'antd';

const { Header } = Layout


export default () => {
    return (
        <Layout>
            <Header className="header">
              <div className="logo" />
              <h2>Picture Editer</h2>
            </Header>
        </Layout>
    )
}