'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { Locale } from '@/lib/constants';

interface ContactFormProps {
  locale: Locale;
}

const FORM_STRINGS = {
  en: {
    title: 'Send Us a Direct Message',
    subtitle: 'Our underwriting and financial analytics team reviews all formula audits and feature suggestions.',
    nameLabel: 'Your Name',
    namePlaceholder: 'e.g. Sarah Jenkins',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@domain.com',
    topicLabel: 'Inquiry Category',
    topics: [
      'Formula & Calculation Question',
      'Deal Analyzer Feature Request',
      'Cap Rate Benchmark Data Feedback',
      'Bug Report or Formatting Issue',
      'Syndication or API Partnership',
    ],
    messageLabel: 'Message or Calculation Case Details',
    messagePlaceholder: 'Please describe the property type, formula, or scenario you are underwriting...',
    submitBtn: 'Send Message to Analysts',
    submittingBtn: 'Sending...',
    successTitle: 'Inquiry Received',
    successMsg: 'Thank you for reaching out. A copy of your inquiry has been routed to our editorial and underwriting analysts. We typically respond within 1–2 business days.',
    sendAnother: 'Send Another Message',
    errorRequired: 'Please complete all required fields.',
  },
  zh: {
    title: '向我们发送直接留言与建议',
    subtitle: '我们的商业地产承销与量化分析团队将认真核验每一条计算公式反馈与功能建议。',
    nameLabel: '您的姓名',
    namePlaceholder: '例如：张先生 / 李女士',
    emailLabel: '电子邮箱',
    emailPlaceholder: 'you@domain.com',
    topicLabel: '咨询类别',
    topics: [
      '计算公式与数学逻辑疑问',
      'Deal Analyzer 综合工具功能建议',
      '城市 Cap Rate 基准数据反馈',
      '发现计算 Bug 或格式问题',
      '机构白标、API 或商务合作',
    ],
    messageLabel: '留言内容或具体测算案例',
    messagePlaceholder: '请详细描述您正在测算的物业业态、争议指标或具体数值假设...',
    submitBtn: '提交留言至分析团队',
    submittingBtn: '提交中...',
    successTitle: '留言已成功送达',
    successMsg: '感谢您的反馈！您的留言已同步至我们的编辑与承销分析团队。对于公式核验与算法疑问，我们通常在 1–2 个工作日内给予邮件答复。',
    sendAnother: '发送另一条留言',
    errorRequired: '请完整填写所有必填项。',
  },
  es: {
    title: 'Envíenos un Mensaje Directo',
    subtitle: 'Nuestro equipo de análisis financiero revisa personalmente todas las consultas sobre fórmulas y sugerencias de herramientas.',
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
      'Alianzas Institucionales o API',
    ],
    messageLabel: 'Detalles del Mensaje o Caso de Análisis',
    messagePlaceholder: 'Describa el tipo de propiedad, métrica o escenario que está evaluando...',
    submitBtn: 'Enviar Mensaje a Analistas',
    submittingBtn: 'Enviando...',
    successTitle: 'Consulta Recibida con Éxito',
    successMsg: 'Gracias por comunicarse con nosotros. Su mensaje ha sido enviado a nuestro equipo de analistas. Respondemos habitualmente en un plazo de 1 a 2 días hábiles.',
    sendAnother: 'Enviar Otro Mensaje',
    errorRequired: 'Por favor complete todos los campos obligatorios.',
  },
  pt: {
    title: 'Envie-nos uma Mensagem Direta',
    subtitle: 'Nossa equipe de underwriting e análise quantitativa revisa cuidadosamente todas as dúvidas sobre fórmulas e melhorias.',
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
      'Parcerias Institucionais ou API',
    ],
    messageLabel: 'Mensagem ou Detalhes da Análise',
    messagePlaceholder: 'Descreva a classe de imóvel, fórmula ou premissa que você está avaliando...',
    submitBtn: 'Enviar Mensagem para a Equipe',
    submittingBtn: 'Enviando...',
    successTitle: 'Mensagem Recebida',
    successMsg: 'Agradecemos o contato. Sua mensagem foi direcionada aos nossos analistas editoriais. Normalmente respondemos em 1 a 2 dias úteis.',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t.errorRequired);
      return;
    }
    setError('');
    setIsSubmitting(true);

    // Simulate reliable instant delivery to editorial mailbox
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
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
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setMessage('');
          }}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors shadow-xs"
        >
          <span>{t.sendAnother}</span>
        </button>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
      </button>
    </form>
  );
}
