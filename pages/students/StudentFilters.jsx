import studentService from '../../services/student.service'

const StudentFilters = ({ filters, onChange }) => {
  const grades = studentService.getGradesList()
  const sections = studentService.getSectionsList()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.grade || 'all'}
        onChange={(e) => onChange('grade', e.target.value)}
        className="input-field w-auto"
      >
        <option value="all">All Grades</option>
        {grades.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        value={filters.section || 'all'}
        onChange={(e) => onChange('section', e.target.value)}
        className="input-field w-auto"
      >
        <option value="all">All Sections</option>
        {sections.map(s => (
          <option key={s} value={s}>Section {s}</option>
        ))}
      </select>

      <select
        value={filters.status || 'all'}
        onChange={(e) => onChange('status', e.target.value)}
        className="input-field w-auto"
      >
        <option value="all">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {(filters.grade !== 'all' || filters.section !== 'all' || filters.status !== 'all') && (
        <button
          onClick={() => onChange('reset')}
          className="text-sm text-primary hover:text-primary-light"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

export default StudentFilters
