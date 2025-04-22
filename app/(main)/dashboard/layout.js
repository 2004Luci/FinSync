import { Suspense } from "react";
import DashBoardPage from "./page";
import { BarLoader } from "react-spinners";

const DashboardLayout = () => {
    return (
        <section className="px-5">
            <h1 className="text-6xl font-bold gradient-text-small mb-5">Dashboard</h1>
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#66FCF1" />}>
                <DashBoardPage />
            </Suspense>
        </section>
    );
};

export default DashboardLayout