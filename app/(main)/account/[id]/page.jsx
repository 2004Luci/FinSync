import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import AccountChart from '../_components/AccountChart';
import TransactionsTable from '../_components/TransactionsTable';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';

const Accounts = async ({ params }) => {

    const accountData = await getAccountWithTransactions(params.id);
    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData;

    return (
        <div className='space-y-8 px-5'>
            <div className='flex gap-4 items-end justify-between'>
                <div>
                    <h1 className='text-5xl sm:text-6xl font-bold  gradient-text-small md:gradient-text-normal lg:gradient-text capitalize'>{account.name}</h1>
                    <p className='text-subtext'>{account.type} Account</p>
                </div>
                <div className='text-right pb-2'>
                    <div className='text-main text-xl sm:text-2xl font-bold'>₹{parseFloat(account.balance).toFixed(2)}</div>
                    <p className='text-sm text-subtext'>{account._count.transactions} Transactions</p>
                </div>
            </div>
            {/* Chart Section */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#66FCF1' />}>
                <AccountChart transactions={transactions} />
            </Suspense>
            {/* Transaction Table */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#66FCF1' />}>
                <TransactionsTable transactions={transactions} />
            </Suspense>
        </div>
    )
}

export default Accounts