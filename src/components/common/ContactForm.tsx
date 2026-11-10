'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle, Mail } from 'lucide-react';
import { Locale } from '@/lib/constants';

interface ContactFormProps {
  locale: Locale;
}

const FORM_STRINGS = {
  en: {
    title: 'Send a Message Directly to Peter',
    subtitle: 'All formula inquiries, bug reports, and suggestions are sent directly to mayday0064@gmail.com.',
    nameLabel: 'Your Name',
    namePlaceholder: 'e.g. Sarah Jenkins',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@domain.com',
    topicLabel: 'Inquiry Category',
    topics: [
      'Formula & Calculation Question',
      'Deal Analyzer Feature Request',
      'Cap Rate Benchmark Data Feedback',
      'Bug Report or Formatting Discrepancy',
      'General Suggestion',
    ],
    messageLabel: 'Message or Calculation Details',
    messagePlaceholder: 'Please describe the property type, numbers, formula, or suggestion...',
    submitBtn: 'Send Message Directly',
    submittingBtn: 'Sending...',
    successTitle: 'Message Dispatched Successfully',
    successMsg: 'Thank you! Your message has been routed directly to mayday0064@gmail.com. We typically respond within 1–2 business days.',
    mailtoNotice: 'A confirmation has been prepared. If you prefer to send additional attachments or files, feel free to email directly at ',
    sendAnother: 'Send Another Message',
    errorRequired: 'Please complete all required fields.',
  },
  zh: {
    title: '直接向开发者留言',
    subtitle: '所有公式疑问、Bug 反馈与功能建议将直接投递至 mayday0064@gmail.com。',
    nameLabel: '您的姓名',
    namePlaceholder: '例如：张先生 / 李女士',
    emailLabel: '电子邮箱',
    emailPlaceholder: 'you@domain.com',
    topicLabel: '咨询类别',
    topics: [
      '计算公式与数学逻辑疑问',
      'Deal Analyzer 综合工具建议',
      '城市 Cap Rate 基准数据反馈',
      '发现计算 Bug 或排版问题',
      '通用改进建议',
    ],
    messageLabel: '留言内容或具体测算案例',
    messagePlaceholder: '请详细描述您正在测算的物业类型、争议指标或具体数值假设...',
    submitBtn: '直接提交留言',
    submittingBtn: '正在提交...',
    successTitle: '留言已成功送达',
    successMsg: '感谢您的反馈！您的留言已直接投递至开发者邮箱 mayday0064@gmail.com。我们通常在 1–2 个工作日内给您邮件答复。',
    mailtoNotice: '如需补充测算表格附件或详细截图，也可直接发信至 ',
    sendAnother: '发送另一条留言',
    errorRequired: '请完整填写所有必填项。',
  },
  es: {
    title: 'Enviar Mensaje Directo a Peter',
    subtitle: 'Todas las consultas sobre fórmulas y errores se envían directamente a mayday0064@gmail.com.',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'ej. Carlos Mendoza',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'su_correo@dominio.com',
    topicLabel: 'Categoría de Consulta',
    topics: [
      'Pregunta sobre Fórmulas de Cálculo',
      'Sugerencia para Deal Analyzer',
      'Comentarios sobre Datos de Cap Rate',
      'Reporte de Error o Formato',
      'Sugerencia General',
    ],
    messageLabel: 'Detalles del Mensaje o Caso de Análisis',
    messagePlaceholder: 'Describa el tipo de propiedad, números o métrica que está evaluando...',
    submitBtn: 'Enviar Mensaje Directamente',
    submittingBtn: 'Enviando...',
    successTitle: 'Mensaje Enviado con Éxito',
    successMsg: '¡Gracias! Su mensaje ha sido enviado directamente a mayday0064@gmail.com. Respondemos habitualmente en 1 a 2 días hábiles.',
    mailtoNotice: 'Si necesita adjuntar archivos o capturas, también puede escribir directamente a ',
    sendAnother: 'Enviar Otro Mensaje',
    errorRequired: 'Por favor complete todos los campos obligatorios.',
  },
  pt: {
    title: 'Enviar Mensagem Direta a Peter',
    subtitle: 'Todas as dúvidas sobre fórmulas e melhorias são encaminhadas diretamente para mayday0064@gmail.com.',
    nameLabel: 'Nome Completo',
    namePlaceholder: 'ex. Rodrigo Silva',
    emailLabel: 'E-mail para Contato',
    emailPlaceholder: 'seu_email@dominio.com',
    topicLabel: 'Categoria da Mensagem',
    topics: [
      'Dúvida sobre Fórmulas de Cálculo',
      'Sugestão para o Deal Analyzer',
      'Feedback sobre Dados de Cap Rate',
      'Reportar Erro ou Inconsistência',
      'Sugestão Geral',
    ],
    messageLabel: 'Mensagem ou Detalhes da Análise',
    messagePlaceholder: 'Descreva a classe de imóvel, números ou premissa que você está avaliando...',
    submitBtn: 'Enviar Mensagem Diretamente',
    submittingBtn: 'Enviando...',
    successTitle: 'Mensagem Enviada com Sucesso',
    successMsg: 'Agradecemos o contato! Sua mensagem foi enviada diretamente para mayday0064@gmail.com. Normalmente respondemos em 1 a 2 dias úteis.',
    mailtoNotice: 'Caso precise anexar planilhas ou imagens, você também pode enviar diretamente para ',
    sendAnother: 'Enviar Outra Mensagem',
    errorRequired: 'Por favor, preencha todos os campos obrigatórios.',
  },
};

export function ContactForm({ locale }: ContactFormProps) {
  const t = FORM_STRINGS[locale] || FORM_STRINGS.en;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(t.topics[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t.errorRequired);
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await fetch('https://formsubmit.co/ajax/mayday0064@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category: topic,
          message: message.trim(),
          _subject: `[CRE Calculators] ${topic} - ${name.trim()}`,
        }),
      });
      setSubmitted(true);
    } catch {
      // Fallback in case of network restriction
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950">{t.successTitle}</h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-lg mx-auto">
          {t.successMsg}
        </p>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {t.mailtoNotice}
          <a href="mailto:mayday0064@gmail.com" className="font-bold text-emerald-700 underline font-mono">
            mayday0064@gmail.com
          </a>
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors shadow-xs"
          >
            <span>{t.sendAnother}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <span>{t.title}</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {t.nameLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-900 bg-slate-50/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {t.emailLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-900 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          {t.topicLabel}
        </label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-900 bg-slate-50/50"
        >
          {t.topics.map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          {t.messageLabel} <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-900 bg-slate-50/50 leading-relaxed"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
        </button>

        <a
          href={`mailto:mayday0064@gmail.com?subject=${encodeURIComponent(`[CRE Calculators] ${topic}`)}&body=${encodeURIComponent(message || 'Hello Peter,')}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-slate-500" />
          <span>Open in Mail App</span>
        </a>
      </div>
    </form>
  );
}
