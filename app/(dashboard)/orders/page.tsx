export default function OrdersPage() {
  // لیست سفارشات نمونه
  const orders = [
    { id: '#۱۰۰۱', customer: 'علی محمدی', amount: '۲,۴۵۰,۰۰۰', status: 'پرداخت شده', date: '۱۴۰۵/۰۴/۲۵' },
    { id: '#۱۰۰۲', customer: 'سارا احمدی', amount: '۸۹۰,۰۰۰', status: 'در انتظار', date: '۱۴۰۵/۰۴/۲۴' },
    { id: '#۱۰۰۳', customer: 'رضا کریمی', amount: '۵,۶۰۰,۰۰۰', status: 'پرداخت شده', date: '۱۴۰۵/۰۴/۲۴' },
    { id: '#۱۰۰۴', customer: 'مریم حسینی', amount: '۱,۲۰۰,۰۰۰', status: 'لغو شده', date: '۱۴۰۵/۰۴/۲۳' },
    { id: '#۱۰۰۵', customer: 'احمد نوری', amount: '۳,۳۰۰,۰۰۰', status: 'در انتظار', date: '۱۴۰۵/۰۴/۲۳' },
    { id: '#۱۰۰۶', customer: 'زهرا رضایی', amount: '۴,۲۰۰,۰۰۰', status: 'پرداخت شده', date: '۱۴۰۵/۰۴/۲۲' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'پرداخت شده': return 'bg-green-100 text-green-800';
      case 'در انتظار': return 'bg-yellow-100 text-yellow-800';
      case 'لغو شده': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛒 مدیریت سفارشات</h1>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>همه سفارشات</option>
            <option>پرداخت شده</option>
            <option>در انتظار</option>
            <option>لغو شده</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 text-sm font-semibold">شناسه</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">مشتری</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">مبلغ</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">وضعیت</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 text-gray-800 font-medium">{order.id}</td>
                <td className="p-4 text-gray-800">{order.customer}</td>
                <td className="p-4 text-gray-800 font-medium">{order.amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}