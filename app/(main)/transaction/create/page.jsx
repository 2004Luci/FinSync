import { getUserAccounts } from "@/actions/dashboard";
import AddTransactionForm from "../_components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";
import { getTransaction } from "@/actions/transaction";


const AddTransaction = async ({ searchParams }) => {

    const accounts = await getUserAccounts();

    const editId = searchParams?.edit;

    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    return (
        <div className='max-w-3xl mx-auto px-5'>
            <h1 className="mb-8 text-5xl gradient-text-small md:gradient-text-normal lg:gradient-text">{editId ? "Edit" : "Add"} Transaction</h1>
            <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData} />
        </div>
    )
}

export default AddTransaction