'use client';

import { useState } from 'react';

interface DermatologyChecklistProps {
  data: any;
  onChange: (data: any) => void;
}

export default function DermatologyChecklist({ data, onChange }: DermatologyChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const current = data[field] || [];
    const updated = checked 
      ? [...current, value]
      : current.filter((item: string) => item !== value);
    handleChange(field, updated);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">Informações Adicionais</h3>
          <span className="text-sm text-gray-500">(Opcional)</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* 1. Morfologia Principal */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">1. Morfologia Principal (Tipo de Lesão)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Plana (Cor):</h5>
                <div className="space-y-2">
                  {['Mácula (até 1 cm)', 'Mancha (acima de 1 cm)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="morfologia_plana"
                        value={option}
                        checked={data.morfologia_plana === option}
                        onChange={(e) => handleChange('morfologia_plana', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Sólida (Elevada):</h5>
                <div className="space-y-2">
                  {['Pápula (até 1 cm)', 'Placa (superficial, > 1 cm)', 'Nódulo (profundo, > 1 cm)', 'Urticária (edema fugaz)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="morfologia_solida"
                        value={option}
                        checked={data.morfologia_solida === option}
                        onChange={(e) => handleChange('morfologia_solida', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Conteúdo Líquido:</h5>
                <div className="space-y-2">
                  {['Vesícula (até 1 cm, clara)', 'Bolha/Flictena (> 1 cm, clara)', 'Pústula (com pus)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="morfologia_liquido"
                        value={option}
                        checked={data.morfologia_liquido === option}
                        onChange={(e) => handleChange('morfologia_liquido', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Secundária (Perda/Reparo):</h5>
                <div className="space-y-2">
                  {['Úlcera', 'Erosão', 'Cicatriz', 'Atrofia', 'Liquenificação'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.secundaria_perda || []).includes(option)}
                        onChange={(e) => handleArrayChange('secundaria_perda', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Secundária (Camadas/Conteúdo):</h5>
                <div className="space-y-2">
                  {['Escama', 'Crosta', 'Escoriação'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.secundaria_camadas || []).includes(option)}
                        onChange={(e) => handleArrayChange('secundaria_camadas', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Atributos Visuais */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">2. Atributos Visuais e Físicos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Coloração:</h5>
                <div className="space-y-2">
                  {['Eritematosa (Vermelha)', 'Hipocrômica (Clara)', 'Hipercrômica (Escura)', 'Violácea', 'Purpúrica (Não some à pressão)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.coloracao || []).includes(option)}
                        onChange={(e) => handleArrayChange('coloracao', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Bordas/Limites:</h5>
                <div className="space-y-2">
                  {['Bem Delimitadas', 'Mal Delimitadas (Difusas)', 'Irregulares'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="bordas"
                        value={option}
                        checked={data.bordas === option}
                        onChange={(e) => handleChange('bordas', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Superfície:</h5>
                <div className="space-y-2">
                  {['Lisa', 'Rugosa/Verrucosa', 'Descamativa', 'Úmida/Exsudativa', 'Umbilicada (Depressão central)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.superficie || []).includes(option)}
                        onChange={(e) => handleArrayChange('superficie', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Distribuição e Arranjo */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">3. Distribuição e Arranjo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Arranjo das Lesões:</h5>
                <div className="space-y-2">
                  {['Isoladas', 'Agrupadas', 'Confluentes', 'Linear', 'Anular (Em anel)', 'Em Alvo'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.arranjo || []).includes(option)}
                        onChange={(e) => handleArrayChange('arranjo', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Medida:</h5>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Tamanho aproximado:</span>
                  <input
                    type="number"
                    value={data.tamanho || ''}
                    onChange={(e) => handleChange('tamanho', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="0"
                  />
                  <span className="text-sm">cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Localização Adicional */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">4. Localização Detalhada no Corpo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Cabeça e Pescoço:</h5>
                <div className="space-y-2">
                  {['Face (Rosto)', 'Couro Cabeludo', 'Pescoço', 'Mucosa Oral (Boca)'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.localizacao_cabeca || []).includes(option)}
                        onChange={(e) => handleArrayChange('localizacao_cabeca', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Tronco:</h5>
                <div className="space-y-2">
                  {['Tronco Anterior (Peito/Abdômen)', 'Tronco Posterior (Costas)', 'Axilas'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.localizacao_tronco || []).includes(option)}
                        onChange={(e) => handleArrayChange('localizacao_tronco', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Outros:</h5>
                <div className="space-y-2">
                  {['Membros Superiores', 'Membros Inferiores', 'Região Genital', 'Região Intertriginosa', 'Unhas'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.localizacao_outros || []).includes(option)}
                        onChange={(e) => handleArrayChange('localizacao_outros', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Sintomas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">5. Sintomas Associados</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Prurido (Coceira)', 'Dor', 'Ardor/Queimação', 'Assintomática'].map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(data.sintomas || []).includes(option)}
                    onChange={(e) => handleArrayChange('sintomas', option, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Achados Complementares */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">6. Achados Complementares</h4>
            
            {/* Biópsia */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-2">A. Biópsia Associada:</h5>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="biopsia"
                      value="sim"
                      checked={data.biopsia === 'sim'}
                      onChange={(e) => handleChange('biopsia', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Sim, há biópsia da lesão</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="biopsia"
                      value="nao"
                      checked={data.biopsia === 'nao'}
                      onChange={(e) => handleChange('biopsia', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Não há biópsia</span>
                  </label>
                </div>

                {data.biopsia === 'sim' && (
                  <div className="ml-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium">Tipo de Biópsia:</span>
                      <div className="flex flex-wrap gap-4 mt-1">
                        {['Punch', 'Shaving', 'Excisional', 'Incisional'].map(tipo => (
                          <label key={tipo} className="flex items-center">
                            <input
                              type="radio"
                              name="tipo_biopsia"
                              value={tipo}
                              checked={data.tipo_biopsia === tipo}
                              onChange={(e) => handleChange('tipo_biopsia', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resultado Histopatológico:
                      </label>
                      <textarea
                        value={data.resultado_histopatologico || ''}
                        onChange={(e) => handleChange('resultado_histopatologico', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Descreva o resultado..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Linfadenopatia */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-2">B. Linfadenopatia:</h5>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="linfadenopatia"
                      value="sim"
                      checked={data.linfadenopatia === 'sim'}
                      onChange={(e) => handleChange('linfadenopatia', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Sim, há linfonodos palpáveis/aumentados</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="linfadenopatia"
                      value="nao"
                      checked={data.linfadenopatia === 'nao'}
                      onChange={(e) => handleChange('linfadenopatia', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Não há biópsia</span>
                  </label>
                </div>

                {data.linfadenopatia === 'sim' && (
                  <div className="ml-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium">Localização:</span>
                      <div className="flex flex-wrap gap-4 mt-1">
                        {['Cervical', 'Axilar', 'Inguinal', 'Generalizada'].map(tipo => (
                          <label key={tipo} className="flex items-center">
                            <input
                              type="radio"
                              name="local_linfadenopatia"
                              value={tipo}
                              checked={data.local_linfadenopatia === tipo}
                              onChange={(e) => handleChange('local_linfadenopatia', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Características:</span>
                      <div className="flex flex-wrap gap-4 mt-1">
                        {['Móvel/Elástico', 'Fixo/Endurecido', 'Doloroso'].map(tipo => (
                          <label key={tipo} className="flex items-center">
                            <input
                              type="radio"
                              name="caracter_linfadenopatia"
                              value={tipo}
                              checked={data.caracter_linfadenopatia === tipo}
                              onChange={(e) => handleChange('caracter_linfadenopatia', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Sorologias */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-2">C. Sorologias:</h5>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <div className="w-full ml-4 space-y-3">
                    <div className='w-full'>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liste as principais sorologias e seus resultados (se não for relevante para o caso, deixe em branco):
                      </label>
                      <textarea
                        value={data.sorologias || ''}
                        onChange={(e) => handleChange('sorologias', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Principais sorologias e seus resultados"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exames */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-4">7. Exames Realizados:</h4>
              
              {/* Microbiológicos */}
              <div>
                <h6 className="text-sm font-medium text-gray-600 mb-2">Exames Microbiológicos:</h6>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Exame</th>
                        <th className="text-center py-2 w-20">Positivo</th>
                        <th className="text-center py-2 w-20">Negativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Cultura bacteriana/Fungos', 'Tzanck (Herpes)', 'Exame Direto'].map(exame => (
                        <tr key={exame} className="border-b">
                          <td className="py-2">{exame}</td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`micro_${exame}`}
                              value="P"
                              checked={data[`micro_${exame}`] === 'P'}
                              onChange={(e) => handleChange(`micro_${exame}`, e.target.value)}
                            />
                          </td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`micro_${exame}`}
                              value="N"
                              checked={data[`micro_${exame}`] === 'N'}
                              onChange={(e) => handleChange(`micro_${exame}`, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PCR */}
              <div>
                <h6 className="text-sm font-medium text-gray-600 mb-2">PCR de Urina de Primeiro Jato:</h6>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Patógeno</th>
                        <th className="text-center py-2 w-20">Positivo</th>
                        <th className="text-center py-2 w-20">Negativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Chlamydia trachomatis', 'Neisseria gonorrhoeae', 'Mycoplasma genitalium', 'Trichomonas vaginalis', 'Outro Específico'].map(patogeno => (
                        <tr key={patogeno} className="border-b">
                          <td className="py-2">{patogeno}</td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`pcr_${patogeno}`}
                              value="P"
                              checked={data[`pcr_${patogeno}`] === 'P'}
                              onChange={(e) => handleChange(`pcr_${patogeno}`, e.target.value)}
                            />
                          </td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`pcr_${patogeno}`}
                              value="N"
                              checked={data[`pcr_${patogeno}`] === 'N'}
                              onChange={(e) => handleChange(`pcr_${patogeno}`, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sorologias */}
              <div>
                <h6 className="text-sm font-medium text-gray-600 mb-2">Sorologias - ISTs e Outras:</h6>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Sorologia</th>
                        <th className="text-center py-2 w-20">Positivo</th>
                        <th className="text-center py-2 w-20">Negativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Sífilis (VDRL/RPR)', 'Sífilis (FTA-ABS/TPHA)', 'HIV (Anti-HIV 1/2)', 'Hepatite B/C', 'Herpes Simples (IgM/IgG)', 'Outro Específico'].map(sorologia => (
                        <tr key={sorologia} className="border-b">
                          <td className="py-2">{sorologia}</td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`soro_${sorologia}`}
                              value="P"
                              checked={data[`soro_${sorologia}`] === 'P'}
                              onChange={(e) => handleChange(`soro_${sorologia}`, e.target.value)}
                            />
                          </td>
                          <td className="text-center py-2">
                            <input
                              type="radio"
                              name={`soro_${sorologia}`}
                              value="N"
                              checked={data[`soro_${sorologia}`] === 'N'}
                              onChange={(e) => handleChange(`soro_${sorologia}`, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}