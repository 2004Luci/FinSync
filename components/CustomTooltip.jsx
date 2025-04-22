const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CustomTooltip = ({ active, payload, pieChartData }) => {
    if (!active || !payload || !payload.length || !pieChartData) return null;

    const value = payload[0].value;
    const name = payload[0].name;

    if (typeof value !== "number" || isNaN(value)) return null;

    const total = pieChartData.reduce((acc, item) => acc + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(1);

    return (
        <div
            style={{
                backgroundColor: 'rgba(102, 252, 241, 0.9)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px',
                color: '#0B0C10',
                border: '1px solid #0B0C10'
            }}
        >
            <div>{`${capitalize(name)}: ${percentage}%`}</div>
        </div>
    );
};

export default CustomTooltip