const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
}

export default function Alert({type = 'info', message}) {
    if (!message) {
        return null
    }

    return (
      <div
        className={`border rounded-xl p-4 text-sm ${styles[type] || styles.info}`}
      >
          {message}
      </div>
    )
}