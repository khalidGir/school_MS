import { PrinterIcon } from '@heroicons/react/24/outline'

export default function Receipt({
  receipt,
  schoolInfo,
  onPrint,
}) {
  if (!receipt) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Receipt Preview</h3>
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
          >
            <PrinterIcon className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>

      <div className="p-6" id="receipt-content">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{schoolInfo?.name || 'School Name'}</h2>
          <p className="text-sm text-gray-500">{schoolInfo?.address || 'School Address'}</p>
          <p className="text-sm text-gray-500">
            {schoolInfo?.phone && `Phone: ${schoolInfo.phone}`}
          </p>
        </div>

        <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Receipt No:</p>
              <p className="font-medium text-gray-900">{receipt.receiptNo}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Date:</p>
              <p className="font-medium text-gray-900">{formatDate(receipt.date)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Received from:</p>
          <p className="font-medium text-gray-900">{receipt.studentName}</p>
          <p className="text-sm text-gray-500">Grade: {receipt.grade}</p>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
              <th className="text-right py-2 text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2 text-sm text-gray-700">{item.description}</td>
                <td className="py-2 text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 text-sm font-medium text-gray-900">Total</td>
              <td className="py-3 text-sm font-bold text-gray-900 text-right">
                {formatCurrency(receipt.total)}
              </td>
            </tr>
            <tr>
              <td className="py-1 text-sm text-gray-500">Payment Method</td>
              <td className="py-1 text-sm text-gray-900 text-right">{receipt.paymentMethod}</td>
            </tr>
          </tfoot>
        </table>

        {receipt.notes && (
          <div className="mb-6 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Notes:</p>
            <p className="text-sm text-gray-700">{receipt.notes}</p>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 mt-8">
          <p>Thank you for your payment!</p>
        </div>
      </div>
    </div>
  )
}
