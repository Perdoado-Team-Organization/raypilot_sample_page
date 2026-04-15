import { useState, useRef, useEffect } from 'react'
import RayPilot from 'raypilot'
import './App.css'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_API_URL

const client = new RayPilot({
  apiKey: API_KEY,
  baseUrl: BASE_URL,
  timeout: 180000,
  pollInterval: 2000,
  maxPollAttempts: 600,
})

// ==================== SVG ICONS ====================
const IconXray = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 13v4M9 17h6M9 14l-1.5 3M15 14l1.5 3" />
  </svg>
)

const IconUpload = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const IconFile = ({ type }) => {
  if (type === 'dicom') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M12 12.5v3M10 15.5h4" />
    </svg>
  )
  if (type === 'zip') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
      <rect x="1" y="4" width="22" height="4" rx="1" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
  return <IconFolder />
}

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconBot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="3" />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" />
    <circle cx="15" cy="14" r="1.5" fill="currentColor" />
    <path d="M12 2v4M8 8V6M16 8V6" />
  </svg>
)

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconLoader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-spin">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
)

function App() {
  const [screen, setScreen] = useState('upload')

  // Upload state
  const [files, setFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  // Chat state
  const [jobId, setJobId] = useState(null)
  const [jobResult, setJobResult] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const previews = files.map(f => {
      const isDicom = f.name.endsWith('.dcm') || f.name.endsWith('.dicom')
      const isImage = f.type.startsWith('image/')
      const isZip = f.type === 'application/zip' || f.name.endsWith('.zip')
      return {
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
        url: isImage ? URL.createObjectURL(f) : null,
        type: isDicom ? 'dicom' : isZip ? 'zip' : isImage ? 'image' : 'other',
      }
    })
    setFilePreviews(previews)
    return () => previews.forEach(p => p.url && URL.revokeObjectURL(p.url))
  }, [files])

  // ==================== UPLOAD FLOW ====================
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selected])
    setUploadError('')
    e.target.value = ''
  }

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const extractImages = (result) => {
    const imgs = []
    if (result.results) {
      for (const r of result.results) {
        if (r.imageUrl) {
          imgs.push({ name: r.filename, url: r.imageUrl, dicomInfo: r.dicomInfo })
        } else if (r.jpegBase64) {
          imgs.push({ name: r.filename, url: `data:image/jpeg;base64,${r.jpegBase64}`, dicomInfo: r.dicomInfo })
        }
      }
    }
    if (imgs.length === 0 && files.length > 0) {
      for (const f of files) {
        if (f.type.startsWith('image/')) {
          imgs.push({ name: f.name, url: URL.createObjectURL(f), dicomInfo: null })
        }
      }
    }
    return imgs
  }

  const loadChatHistory = async (currentJobId, result) => {
    try {
      const history = await client.chat.getHistory(currentJobId)
      if (history && history.messages && history.messages.length > 0) {
        setMessages(history.messages)
      }
    } catch {
      const initialMessages = []
      if (result && result.aiAnalysis && result.aiAnalysis.analysis) {
        initialMessages.push({
          role: 'assistant',
          content: result.aiAnalysis.analysis,
          timestamp: result.timestamp || new Date().toISOString(),
        })
      }
      setMessages(initialMessages)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(5)
    setStatusText('Enviando arquivos para processamento...')
    setUploadError('')

    try {
      const file = files[0]
      const isZip = file.name.endsWith('.zip')

      setProgress(10)

      let result

      if (isZip) {
        // ZIP -> streaming SSE (real-time progress)
        setStatusText('Enviando ZIP. Iniciando streaming...')

        const streamResult = await client.dicom.stream(file, (event) => {
          switch (event.type) {
            case 'job_started':
              if (event.jobId) setJobId(event.jobId)
              setProgress(15)
              setStatusText(`Processamento iniciado${event.filesFound ? ` - ${event.filesFound} arquivo(s) encontrado(s)` : ''}...`)
              break
            case 'progress':
            case 'processing': {
              const p = event.filesProcessed && event.totalFiles
                ? Math.round((event.filesProcessed / event.totalFiles) * 70)
                : 30
              setProgress(15 + p)
              setStatusText(event.currentFile
                ? `Processando: ${event.currentFile}`
                : event.stage || 'Processando arquivos...')
              break
            }
            case 'file_completed':
              setStatusText(`Concluido: ${event.filename || 'arquivo'}`)
              break
            case 'completed':
              setProgress(95)
              setStatusText('Processamento concluido! Carregando resultados...')
              break
            case 'error':
              setStatusText(`Erro: ${event.message || event.error || 'Falha no processamento'}`)
              break
            default:
              break
          }
        }, { filename: file.name })

        result = streamResult
        if (result?.jobId) setJobId(result.jobId)

      } else {
        // DCM / imagem avulsa -> queue + polling
        setStatusText('Enviando arquivo para processamento...')

        const queueResponse = await client.dicom.queue(file)
        const currentJobId = queueResponse.jobId
        setJobId(currentJobId)
        setProgress(15)
        setStatusText('Na fila. Processando DICOM...')

        result = await client.dicom.waitForResult(currentJobId, (statusInfo) => {
          const p = statusInfo.progress || 0
          setProgress(15 + Math.round(p * 0.7))
          if (p < 30) setStatusText('Extraindo metadados DICOM...')
          else if (p < 60) setStatusText('Convertendo imagens...')
          else if (p < 90) setStatusText('Realizando analise com IA...')
          else setStatusText('Finalizando processamento...')
        })
      }

      if (result) {
        setJobResult(result)

        const imgs = extractImages(result)
        setImages(imgs)
        if (imgs.length > 0) setSelectedImage(imgs[0])

        const resolvedJobId = result.jobId || jobId
        if (resolvedJobId) {
          await loadChatHistory(resolvedJobId, result)
        }
      }

      setProgress(100)
      setStatusText('Pronto!')
      setTimeout(() => setScreen('chat'), 600)

    } catch (err) {
      setUploadError(err.message || 'Erro no processamento')
      setStatusText('')
    } finally {
      setUploading(false)
    }
  }

  // ==================== CHAT FLOW ====================
  const handleSendMessage = async () => {
    if (!input.trim() || !jobId) return

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput('')
    setSending(true)

    try {
      const response = await client.chat.send(jobId, currentInput)

      let assistantMsg = null
      if (response.messages && Array.isArray(response.messages)) {
        assistantMsg = [...response.messages].reverse().find(m => m.role === 'assistant')
      }

      if (assistantMsg) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMsg.content,
          timestamp: assistantMsg.timestamp || new Date().toISOString(),
          files: assistantMsg.files || [],
        }])
      } else if (response.message) {
        const content = typeof response.message === 'string'
          ? response.message
          : response.message.content || ''
        if (content) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content,
            timestamp: new Date().toISOString(),
          }])
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Erro: ${err.message || 'Falha ao enviar mensagem'}`,
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
    }
  }

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewExam = () => {
    setScreen('upload')
    setFiles([])
    setFilePreviews([])
    setProgress(0)
    setStatusText('')
    setUploadError('')
    setJobId(null)
    setJobResult(null)
    setMessages([])
    setImages([])
    setSelectedImage(null)
  }

  // ==================== RENDER ====================
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">
            <IconXray /> RayPilot
          </span>
          <span className="topbar-sep" />
          <span className="topbar-label">
            {screen === 'upload' ? 'Envio de Exame' : 'Analise Radiologica'}
          </span>
        </div>
        <div className="topbar-right">
          {jobId && <span className="topbar-job">Job: {jobId.slice(0, 24)}...</span>}
          <span className={`topbar-status ${API_KEY ? 'ok' : 'err'}`}>
            <span className="status-dot" />
            {API_KEY ? 'Conectado' : 'Sem API Key'}
          </span>
        </div>
      </header>

      {/* ==================== UPLOAD SCREEN ==================== */}
      {screen === 'upload' && (
        <div className="upload-screen">
          <div className="upload-container">
            {!uploading ? (
              <>
                <div className="upload-header">
                  <div className="upload-icon"><IconXray /></div>
                  <h1>Enviar Exame para Analise</h1>
                  <p>Envie arquivos DICOM, ZIP com DICOMs ou imagens para analise com IA</p>
                </div>

                <div
                  className="drop-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".dcm,.dicom,.zip,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <div className="drop-icon"><IconUpload /></div>
                  <p className="drop-text">Clique para selecionar ou arraste arquivos aqui</p>
                  <p className="drop-sub">.dcm, .zip, .jpg, .png -- ate 990MB</p>
                </div>

                {filePreviews.length > 0 && (
                  <div className="file-list">
                    {filePreviews.map((fp, i) => (
                      <div key={i} className="file-item">
                        <div className="file-item-icon">
                          {fp.type === 'image' && fp.url ? (
                            <img src={fp.url} alt="" />
                          ) : (
                            <span><IconFile type={fp.type} /></span>
                          )}
                        </div>
                        <div className="file-item-info">
                          <span className="file-item-name">{fp.name}</span>
                          <span className="file-item-size">{fp.size}</span>
                        </div>
                        <button className="file-item-remove" onClick={() => removeFile(i)}>
                          <IconX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadError && (
                  <div className="upload-error">
                    <IconAlert /> {uploadError}
                  </div>
                )}

                <button
                  className="btn-process"
                  onClick={handleUpload}
                  disabled={files.length === 0}
                >
                  Processar Exame com IA
                </button>
              </>
            ) : (
              <div className="processing-state">
                <div className="processing-icon">
                  <div className="spinner" />
                </div>
                <h2>Processando Exame...</h2>
                <p className="processing-status">{statusText}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="progress-pct">{progress}%</span>
                {filePreviews.length > 0 && (
                  <div className="processing-files">
                    {filePreviews.map((fp, i) => (
                      <span key={i} className="processing-file-tag">
                        <IconFile type={fp.type} /> {fp.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CHAT SCREEN ==================== */}
      {screen === 'chat' && (
        <div className="chat-screen">
          <div className="viewer-panel">
            <div className="viewer-header">
              <span className="viewer-header-title"><IconImage /> Imagens do Exame</span>
              <div className="viewer-actions">
                {images.length > 0 && (
                  <span className="viewer-count">{images.length} imagem(ns)</span>
                )}
                <button className="btn-new-exam" onClick={handleNewExam}>
                  <IconPlus /> Novo Exame
                </button>
              </div>
            </div>

            <div className="viewer-main">
              {selectedImage ? (
                <img src={selectedImage.url} alt={selectedImage.name} className="viewer-image" />
              ) : (
                <div className="viewer-empty">
                  <IconImage />
                  <span>Nenhuma imagem disponivel</span>
                </div>
              )}
            </div>

            {selectedImage?.dicomInfo && (
              <div className="dicom-info-bar">
                {selectedImage.dicomInfo.patientName && (
                  <span><b>Paciente:</b> {selectedImage.dicomInfo.patientName}</span>
                )}
                {selectedImage.dicomInfo.modality && (
                  <span><b>Modalidade:</b> {selectedImage.dicomInfo.modality}</span>
                )}
                {selectedImage.dicomInfo.studyDescription && (
                  <span><b>Estudo:</b> {selectedImage.dicomInfo.studyDescription}</span>
                )}
                {selectedImage.dicomInfo.studyDate && (
                  <span><b>Data:</b> {selectedImage.dicomInfo.studyDate}</span>
                )}
              </div>
            )}

            {images.length > 1 && (
              <div className="viewer-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${selectedImage?.url === img.url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img.url} alt={img.name} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="chat-panel">
            <div className="chat-header-bar">
              <span className="chat-header-title"><IconChat /> Chat com IA Radiologica</span>
              <span className="chat-msg-count">{messages.length} msg</span>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`msg msg-${msg.role}`}>
                  <div className="msg-avatar">
                    {msg.role === 'user' ? <IconUser /> : msg.role === 'assistant' ? <IconBot /> : <IconAlert />}
                  </div>
                  <div className="msg-body">
                    <div className="msg-meta">
                      <span className="msg-role">
                        {msg.role === 'user' ? 'Voce' : msg.role === 'assistant' ? 'RayPilot IA' : 'Sistema'}
                      </span>
                      <span className="msg-time">
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.role === 'assistant' && i === 0 && images.length > 0 && (
                      <div className="msg-images">
                        {images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={img.name}
                            className="msg-exam-image"
                            onClick={() => setSelectedImage(img)}
                          />
                        ))}
                      </div>
                    )}
                    {msg.files && msg.files.length > 0 && (
                      <div className="msg-images">
                        {msg.files.filter(f => f.url).map((f, idx) => (
                          <img key={idx} src={f.url} alt={f.name} className="msg-exam-image" />
                        ))}
                      </div>
                    )}
                    <div className={`msg-text ${msg.role === 'system' ? 'msg-error' : ''}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="msg msg-assistant">
                  <div className="msg-avatar"><IconBot /></div>
                  <div className="msg-body">
                    <div className="msg-text">
                      <div className="typing"><span /><span /><span /></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="chat-suggestions-bar">
                <button onClick={() => setInput('Quais sao os achados principais?')}>Achados principais?</button>
                <button onClick={() => setInput('Existe alguma alteracao significativa?')}>Alteracoes?</button>
                <button onClick={() => setInput('Gere um laudo estruturado')}>Gerar laudo</button>
                <button onClick={() => setInput('Qual o diagnostico diferencial?')}>Diagnostico diferencial?</button>
              </div>
            )}

            <div className="chat-input-bar">
              <div className="input-row">
                <textarea
                  className="chat-textarea"
                  placeholder="Pergunte sobre o exame..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  rows={1}
                />
                <button
                  className="btn-send"
                  onClick={handleSendMessage}
                  disabled={sending || !input.trim()}
                >
                  {sending ? <IconLoader /> : <IconSend />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
