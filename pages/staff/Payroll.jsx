import { useState, useEffect } from 'react'
import { PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '../../utils/formatters'
import staffService from '../../services/staff.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SearchableSelect from '../../components/common/SearchableSelect'

function Payroll() {
  const [payroll, setPayroll] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [selectedPayslip, setSelectedPayslip] = useState(null)
  const [showPayslip, setShowPayslip] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [payrollRes, staffRes] = await Promise.all([
        staffService.getPayroll(),
        staffService.getAll(),
      ])
      if (payrollRes.success) setPayroll(payrollRes.data)
      if (staffRes.success) setStaff(staffRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePayslip = async (staffId) => {
    const payslipRes = await staffService.generatePayslip(staffId, 'January 2024')
    if (payslipRes.success) {
      setSelectedPayslip(payslipRes.data)
      setShowPayslip(true)
    }
  }

  const printPayslip = () => {
    window.print()
  }

  if (loading) return <LoadingSpinner text="Loading payroll..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Payroll Management</h2>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Role</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Basic Salary</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Allowances</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Deductions</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Net Salary</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payroll.map(p => (
                <tr key={p.staffId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{p.staffName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{p.employeeId}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{p.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(p.basicSalary)}</td>
                  <td className="py-3 px-4 text-sm text-[#2c7a4d] text-right">{formatCurrency(p.allowances)}</td>
                  <td className="py-3 px-4 text-sm text-[#c73e2c] text-right">{formatCurrency(p.deductions)}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">{formatCurrency(p.netSalary)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#e8f5e9] text-[#2c7a4d]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleGeneratePayslip(p.staffId)}
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                      title="Generate Payslip"
                    >
                      <PrinterIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPayslip && selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payslip</h3>
                <button onClick={() => setShowPayslip(false)} className="text-gray-500 hover:text-gray-700">
                  Close
                </button>
              </div>
              <div className="p-6" id="payslip-content">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">School Name</h2>
                  <p className="text-sm text-gray-500">Payslip for {selectedPayslip.month}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500">Employee Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.staffName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.accountNumber}</p>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Basic Salary</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedPayslip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Allowances</span>
                    <span className="text-sm font-medium text-[#2c7a4d]">+{formatCurrency(selectedPayslip.allowances)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Deductions</span>
                    <span className="text-sm font-medium text-[#c73e2c]">-{formatCurrency(selectedPayslip.deductions)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">Net Salary</span>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(selectedPayslip.netSalary)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setShowPayslip(false)} className="btn-secondary">Close</button>
                <button onClick={printPayslip} className="btn-primary flex items-center gap-2">
                  <PrinterIcon className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payroll
