import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Conditions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const conditionGroups = [
    {
      title: '🫁 Respiratory & ENT',
      items: [
        { name: 'Cold & Cough', icon: '🤧', desc: 'Runny nose, sneezing, dry or wet cough relief', count: '35+ medicines', bg: '#dbeafe', tags: 'cold cough respiratory ent' },
        { name: 'Asthma & Breathing', icon: '🌬️', desc: 'Inhalers, nebulizers, bronchodilators', count: '20+ medicines', bg: '#e0f2fe', tags: 'asthma breathing respiratory' },
        { name: 'Allergies & Sinusitis', icon: '🌸', desc: 'Antihistamines, nasal sprays, decongestants', count: '18+ medicines', bg: '#fce7f3', tags: 'allergy sinus ent nose' },
      ]
    },
    {
      title: '❤️ Cardiovascular & Metabolic',
      items: [
        { name: 'Blood Pressure (BP)', icon: '❤️', desc: 'Antihypertensives, diuretics, beta-blockers', count: '40+ medicines', bg: '#fee2e2', tags: 'blood pressure bp heart cardiovascular hypertension' },
        { name: 'Diabetes / Blood Sugar', icon: '🩸', desc: 'Oral hypoglycemics, insulin, glucometers', count: '50+ medicines', bg: '#fef3c7', tags: 'diabetes sugar blood glucose metabolic' },
        { name: 'Cholesterol', icon: '🫀', desc: 'Statins, fibrates, lipid-lowering drugs', count: '22+ medicines', bg: '#fde8d4', tags: 'cholesterol lipid cardiovascular heart' },
      ]
    },
    {
      title: '🌡️ Pain & Fever',
      items: [
        { name: 'Fever', icon: '🌡️', desc: 'Paracetamol, ibuprofen, antipyretics', count: '30+ medicines', bg: '#dcfce7', tags: 'fever temperature pain paracetamol' },
        { name: 'Headache & Migraine', icon: '🧠', desc: 'Triptans, NSAIDs, migraine patches', count: '25+ medicines', bg: '#ede9fe', tags: 'headache migraine pain neuro' },
        { name: 'Joint & Muscle Pain', icon: '🦴', desc: 'Anti-inflammatory, pain gels, supplements', count: '28+ medicines', bg: '#f0fdf4', tags: 'joint pain arthritis muscle body' },
      ]
    }
  ];

  const filteredGroups = conditionGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      !searchQuery || item.tags.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="conditions-page">
      <div className="hero-section" style={{padding: '56px 0 44px', minHeight: 'auto'}}>
        <div className="container">
          <div className="cond-breadcrumb" style={{display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '14px'}}>
            <Link to="/" style={{color: 'inherit'}}>Home</Link>
            <span>/</span>
            <span style={{color: 'white', fontWeight: 600}}>Health Conditions</span>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="hero-title" style={{fontSize: '2.6rem'}}>Explore by Health <span className="highlight">Condition</span></h1>
              <p className="hero-subtitle">Find the right medicines for your specific health needs.</p>
              <div className="search-wrap" style={{maxWidth: '480px'}}>
                <input 
                  type="text" 
                  placeholder="Search a condition… e.g. Fever, Diabetes" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{paddingRight: '50px'}}
                />
                <span className="search-icon"><i className="fa fa-search"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section-gap">
        <div className="container">
          <div className="cond-info-banner" style={{background: 'linear-gradient(135deg, var(--green-50), #dbeafe)', border: '1.5px solid var(--green-200)', borderRadius: '16px', padding: '24px', display: 'flex', gap: '18px', marginBottom: '40px'}}>
            <div style={{fontSize: '2rem'}}>💊</div>
            <div>
              <h5 style={{fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px'}}>Consult a doctor for prescription medicines</h5>
              <p style={{fontSize: '0.8rem', margin: 0, color: 'var(--gray-600)'}}>Some medicines marked <strong>Rx</strong> require a valid prescription.</p>
            </div>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="text-center py-5">
              <div style={{fontSize: '3rem'}}>🔍</div>
              <h4>No conditions found</h4>
              <p>Try a different search term</p>
            </div>
          ) : (
            filteredGroups.map((group, idx) => (
              <div key={idx} className="mb-5">
                <div className="group-title" style={{fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '10px', borderBottom: '1px solid var(--gray-100)', marginBottom: '18px'}}>{group.title}</div>
                <div className="row g-3">
                  {group.items.map((item, i) => (
                    <div key={i} className="col-lg-4 col-md-6">
                      <Link to={`/products?search=${encodeURIComponent(item.name)}`} className="cond-card" style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 20px', background: 'white', borderRadius: '16px', border: '1.5px solid var(--gray-200)', textDecoration: 'none', color: 'inherit'}}>
                        <div className="cond-card-icon" style={{width: '54px', height: '54px', borderRadius: '14px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.55rem'}}>{item.icon}</div>
                        <div style={{flex: 1}}>
                          <div style={{fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)'}}>{item.name}</div>
                          <div style={{fontSize: '0.76rem', color: 'var(--gray-400)', lineHeight: '1.5'}}>{item.desc}</div>
                          <span style={{background: 'var(--green-50)', color: 'var(--green-700)', fontSize: '0.7rem', fontWeight: 600, padding: '3px 9px', borderRadius: '99px', marginTop: '6px', display: 'inline-block'}}>{item.count}</span>
                        </div>
                        <i className="fa fa-chevron-right" style={{color: 'var(--gray-300)', fontSize: '0.85rem'}}></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Conditions;
