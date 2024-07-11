// Import dayjs and the required plugins
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/pt-br.js'

// Set default locale
dayjs.locale('pt-br')

// Use the plugins
dayjs.extend(duration)
dayjs.extend(relativeTime)

// Export the configured dayjs instance
export default dayjs
