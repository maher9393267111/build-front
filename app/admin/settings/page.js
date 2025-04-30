import RecruterProfileForm from '@components/form/RecruterProfileForm'
import Layout from '@components/layout/dashboard/Layout'
import Card from '@components/ui/Card'

const RecruterProfile = () => {
    return (
        <>
            <Layout breadcrumbTitle={"Settings"}>
                <Card>
                    <RecruterProfileForm />
                </Card>

            </Layout>
        </>
    )
}

export default RecruterProfile