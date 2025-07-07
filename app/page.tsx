"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

interface FormData {
  age: string
  location: string
  cityName: string
  occupation: string
  occupationOther: string
  willVote: string
  votingFactors: string[]
  winningParty: string
  competitionLevel: string
  competitionOther: string
  interests: string[]
  expectations: string
  expectationsOther: string
  concerns: string[]
  concernsOther: string
  confidence: string
  additionalComments: string
}

const initialFormData: FormData = {
  age: "",
  location: "",
  cityName: "",
  occupation: "",
  occupationOther: "",
  willVote: "",
  votingFactors: [],
  winningParty: "",
  competitionLevel: "",
  competitionOther: "",
  interests: [],
  expectations: "",
  expectationsOther: "",
  concerns: [],
  concernsOther: "",
  confidence: "",
  additionalComments: "",
}

export default function MyanmarSurvey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isComplete, setIsComplete] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isStepValid, setIsStepValid] = useState(true)

  const totalSteps = 6

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentValues = formData[field] as string[]
    if (checked) {
      updateFormData(field, [...currentValues, value])
    } else {
      updateFormData(
        field,
        currentValues.filter((item) => item !== value),
      )
    }
  }

  const checkStepValidity = (step: number, data: FormData): string[] => {
    const errors: string[] = []

    switch (step) {
      case 0: // Demographics
        if (!data.age) errors.push("ကျေးဇူးပြု၍ သင့်အသက်အပိုင်းအခြားကို ရွေးချယ်ပါ")
        if (!data.location) errors.push("ကျေးဇူးပြု၍ သင့်နေထိုင်ရာဒေသကို ရွေးချယ်ပါ")
        if (data.location === "urban" && !data.cityName.trim()) {
          errors.push("ကျေးဇူးပြု၍ မြို့အမည်ကို ဖော်ပြပါ")
        }
        if (!data.occupation) errors.push("ကျေးဇူးပြု၍ သင့်အလုပ်အကိုင်ကို ရွေးချယ်ပါ")
        if (data.occupation === "other" && !data.occupationOther.trim()) {
          errors.push("ကျေးဇူးပြု၍ အခြားအလုပ်အကိုင်ကို ဖော်ပြပါ")
        }
        break

      case 1: // Election participation
        if (!data.willVote) errors.push("ကျေးဇူးပြု၍ မဲပေးရန်အစီစဉ်ရှိမရှိကို ရွေးချယ်ပါ")
        if (data.willVote !== "no" && data.willVote !== "" && data.votingFactors.length === 0) {
          errors.push("ကျေးဇူးပြု၍ မဲပေးရာတွင် အဓိကထားသောအချက်များကို ရွေးချယ်ပါ")
        }
        break

      case 2: // Election predictions
        if (!data.winningParty) errors.push("ကျေးဇူးပြု၍ သာလွန်နိုင်ခြေရှိသောပါတီကို ရွေးချယ်ပါ")
        if (!data.competitionLevel) errors.push("ကျေးဇူးပြု၍ ပြိုင်ဆိုင်မှုအဆင့်ကို ရွေးချယ်ပါ")
        if (data.competitionLevel === "other-comp" && !data.competitionOther.trim()) {
          errors.push("ကျေးဇူးပြု၍ အခြားပြိုင်ဆိုင်မှုအဆင့်ကို ဖော်ပြပါ")
        }
        if (data.interests.length === 0) {
          errors.push("ကျေးဇူးပြု၍ စိတ်ဝင်စားသောအကြောင်းအရာများကို ရွေးချယ်ပါ")
        }
        break

      case 3: // Post-election expectations
        if (!data.expectations) errors.push("ကျေးဇူးပြု၍ မျှော်လင့်ချက်ကို ရွေးချယ်ပါ")
        if (data.expectations === "other-expect" && !data.expectationsOther.trim()) {
          errors.push("ကျေးဇူးပြု၍ အခြားမျှော်လင့်ချက်ကို ဖော်ပြပါ")
        }
        if (data.concerns.length === 0) {
          errors.push("ကျေးဇူးပြု၍ စိုးရိမ်စရာများကို ရွေးချယ်ပါ")
        }
        if (data.concerns.includes("other") && !data.concernsOther.trim()) {
          errors.push("ကျေးဇူးပြု၍ အခြားစိုးရိမ်စရာကို ဖော်ပြပါ")
        }
        if (!data.confidence) errors.push("ကျေးဇူးပြု၍ ယုံကြည်မှုအဆင့်ကို ရွေးချယ်ပါ")
        break

      case 4: // Optional feedback - no validation needed
        break
    }

    return errors
  }

  // Check validity whenever form data changes
  useEffect(() => {
    if (currentStep < 4) {
      const errors = checkStepValidity(currentStep, formData)
      setIsStepValid(errors.length === 0)
    } else {
      setIsStepValid(true)
    }
  }, [currentStep, formData])

  const nextStep = async () => {
    if (currentStep < 4) {
      // Validate before proceeding (except for optional feedback step)
      const errors = checkStepValidity(currentStep, formData)
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      setValidationErrors([]) // Clear errors when moving to next step
    } else {
      // Submit the survey data
      try {
        const response = await fetch('/api/survey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (response.ok) {
          setIsComplete(true)
        } else {
          setValidationErrors([result.error || 'စစ်တမ်းကောက်ယူမှုတွင် အမှားရှိနေပါသည်'])
        }
      } catch (error) {
        setValidationErrors(['စစ်တမ်းကောက်ယူမှုတွင် အမှားရှိနေပါသည်'])
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setValidationErrors([]) // Clear errors when going back
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-amber-800 mb-4">မြန်မာနိုင်ငံ အထွေထွေရွေးကောက်ပွဲ လူထုထင်မြင်ချက်စစ်တမ်း</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                ဤစစ်တမ်းသည် မြန်မာနိုင်ငံအထွေထွေရွေးကောက်ပွဲအပေါ် ပြည်သူ၏ထင်မြင်ချက်များကို သိရှိနားလည်လို၍ စစ်တမ်းကောက်ယူခြင်းသာဖြစ်ပါသည်။ အမည်မဖော်ဘဲ
                ဖြေဆိုနိုင်ပါသည်။
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-700">အပိုင်း ၁: အခြေခံအချက်အလက်</h3>

              <div>
                <label className="text-base font-medium">
                  ၁။ သင့်အသက်အပိုင်းအခြား: <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: "18-30", label: "၁၈-၃၀ နှစ်", id: "age1" },
                    { value: "31-45", label: "၃၁-၄၅ နှစ်", id: "age2" },
                    { value: "46-60", label: "၄၆-၆၀ နှစ်", id: "age3" },
                    { value: "60+", label: "၆၀ နှစ်အထက်", id: "age4" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="age"
                        value={item.value}
                        checked={formData.age === item.value}
                        onChange={() => updateFormData("age", item.value)}
                        className="form-radio"
                      />
                      <label htmlFor={item.id}>{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-base font-medium">
                  ၂။ သင့်နေထိုင်ရာဒေသ: <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="urban"
                      name="location"
                      value="urban"
                      checked={formData.location === "urban"}
                      onChange={() => updateFormData("location", "urban")}
                      className="form-radio"
                    />
                    <label htmlFor="urban">မြို့ပြ</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="rural"
                      name="location"
                      value="rural"
                      checked={formData.location === "rural"}
                      onChange={() => updateFormData("location", "rural")}
                      className="form-radio"
                    />
                    <label htmlFor="rural">ကျေးလက်</label>
                  </div>
                </div>
                {formData.location === "urban" && (
                  <Input
                    placeholder="မြို့အမည်ဖော်ပြရန် *"
                    value={formData.cityName}
                    onChange={(e) => updateFormData("cityName", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <label className="text-base font-medium">
                  ၃။ သင့်အလုပ်အကိုင်: <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: "student", label: "ကျောင်းသား/သူ", id: "student" },
                    { value: "farmer", label: "တောင်သူလယ်သမား", id: "farmer" },
                    { value: "business", label: "စီးပွားရေးလုပ်ငန်းရှင်", id: "business" },
                    { value: "government", label: "အစိုးရဝန်ထမ်း", id: "government" },
                    { value: "other", label: "အခြား", id: "other-occupation" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="occupation"
                        value={item.value}
                        checked={formData.occupation === item.value}
                        onChange={() => updateFormData("occupation", item.value)}
                        className="form-radio"
                      />
                      <label htmlFor={item.id}>{item.label}</label>
                    </div>
                  ))}
                </div>
                {formData.occupation === "other" && (
                  <Input
                    placeholder="ဖော်ပြရန် *"
                    value={formData.occupationOther}
                    onChange={(e) => updateFormData("occupationOther", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-700">အပိုင်း ၂: ရွေးကောက်ပွဲပါဝင်မှုနှင့် ရွေးကောက်ပွဲအသိပညာ</h3>

            <div>
              <Label className="text-base font-medium">
                ၄။ ဤရွေးကောက်ပွဲတွင် မဲပေးရန် အစီစဉ်ရှိပါသလား? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.willVote}
                onValueChange={(value) => updateFormData("willVote", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vote-yes" />
                  <Label htmlFor="vote-yes">ရှိ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vote-no" />
                  <Label htmlFor="vote-no">မရှိ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="undecided" id="vote-undecided" />
                  <Label htmlFor="vote-undecided">မဆုံးဖြတ်ရသေး</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.willVote !== "no" && formData.willVote !== "" && (
              <div>
                <Label className="text-base font-medium">
                  ၅။ မဲပေးပါက သင့်အဓိကထားသော အချက်များ? (အားလုံးရွေးနိုင်) <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: "policies", label: "ပါတီမူဝါဒများ" },
                    { id: "personality", label: "ကိုယ်စားလှယ်လောင်း၏ ပုဂ္ဂိုလ်ရေးလွှမ်းမိုးမှု" },
                    { id: "representation", label: "တိုင်းရင်းသား/ဘာသာရေး ကိုယ်စားပြုမှု" },
                    { id: "community", label: "မိသားစု/ကျေးရွာနှစ်သက်မှု" },
                  ].map((factor) => (
                    <div key={factor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor.id}
                        checked={formData.votingFactors.includes(factor.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("votingFactors", factor.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={factor.id}>{factor.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-700">အပိုင်း ၃: ရွေးကောက်ပွဲ ရလာဒ်ခန့်မှန်းခြင်း</h3>

            <div>
              <Label className="text-base font-medium">
                ၆။ မည်သည့်ပါတီ/အဖွဲ့အစည်းက ဤရွေးကောက်ပွဲတွင် သာလွန်နိုင်ခြေပိုများသနည်း? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.winningParty}
                onValueChange={(value) => updateFormData("winningParty", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="military-backed" id="military" />
                  <Label htmlFor="military">တပ်မတော်မှထောက်ခံသည့်ပါတီများ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ethnic" id="ethnic" />
                  <Label htmlFor="ethnic">တိုင်းရင်းသားပါတီများ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reform" id="reform" />
                  <Label htmlFor="reform">ပြုပြင်ပြောင်းလဲရေးအတွက် အသစ်ပေါ်ထွင်လာသောပါတီများ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpredictable" id="unpredictable" />
                  <Label htmlFor="unpredictable">ခန့်မှန်းရခက်</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">
                ၇။ ဤရွေးကောက်ပွဲ၏ ပြိုင်ဆိုင်မှုအဆင့်ကို မည်သို့ထင်မြင်သနည်း? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.competitionLevel}
                onValueChange={(value) => updateFormData("competitionLevel", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-competitive" id="very-comp" />
                  <Label htmlFor="very-comp">အလွန်ပြင်းထန် (ရလာဒ်မှန်းဆရခက်)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat-competitive" id="some-comp" />
                  <Label htmlFor="some-comp">အတိုင်းအတာတစ်ခုထိပြိုင်ဆိုင် (ရလာဒ်ခန့်မှန်းနိုင်)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low-competition" id="low-comp" />
                  <Label htmlFor="low-comp">ပြိုင်ဆိုင်မှုအားနည်း (တစ်ဖက်သတ်အားသာနေ)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other-comp" id="other-comp" />
                  <Label htmlFor="other-comp">အခြား</Label>
                </div>
              </RadioGroup>
              {formData.competitionLevel === "other-comp" && (
                <Input
                  placeholder="ဖော်ပြရန် *"
                  value={formData.competitionOther}
                  onChange={(e) => updateFormData("competitionOther", e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label className="text-base font-medium">
                ၈။ ရွေးကောက်ပွဲတွင် သင်အဓိကစိတ်ဝင်စားသော အကြောင်းအရာများ? (အားလုံးရွေးနိုင်) <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-2">
                {[
                  { id: "unity-peace", label: "တိုင်းရင်းသားစည်းလုံးညီညွတ်ရေးနှင့် ပြည်တွင်းစစ်" },
                  { id: "economy", label: "စီးပွားရေးဖွံ့ဖြိုးတိုးတက်မှုနှင့် အလုပ်အကိုင်" },
                  { id: "democracy", label: "ဒီမိုကရေစီပြုပြင်ပြောင်းလဲမှုနှင့် လူ့အခွင့်အရေး" },
                  { id: "religion-culture", label: "ဘာသာရေးနှင့် လူမှုယဉ်ကျေးမှု" },
                  { id: "anti-corruption", label: "ခြစားမှုတိုက်ဖျက်ရေးနှင့် အစိုးရပွင့်လင်းမြင်သာမှု" },
                ].map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={(checked) => handleCheckboxChange("interests", interest.id, checked as boolean)}
                    />
                    <Label htmlFor={interest.id}>{interest.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-700">အပိုင်း ၄: ရွေးကောက်ပွဲနောက်ပိုင်း မျှော်လင့်ချက်များနှင့် စိုးရိမ်မှုများ</h3>

            <div>
              <Label className="text-base font-medium">
                ၉။ ရွေးကောက်ပွဲအပြီး မြန်မာ့နိုင်ငံရေးအခြေအနေအတွက် သင်၏မျှော်လင့်ချက်ကဘာတွေဖြစ်မလဲ? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.expectations}
                onValueChange={(value) => updateFormData("expectations", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="peace-unity" id="peace" />
                  <Label htmlFor="peace">ငြိမ်းချမ်းရေးနှင့် တိုင်းရင်းသားစည်းလုံးညီညွတ်ရေး ရရှိရန်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="economic-reform" id="econ-reform" />
                  <Label htmlFor="econ-reform">စီးပွားရေးပြုပြင်ပြောင်းလဲမှုများ မြှင့်တင်ရန်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="international-cooperation" id="intl-coop" />
                  <Label htmlFor="intl-coop">နိုင်ငံတကာပူးပေါင်းဆောင်ရွက်မှု အားကောင်းရန်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintain-stability" id="stability" />
                  <Label htmlFor="stability">လက်ရှိတည်ငြိမ်မှုကို ထိန်းသိမ်းရန်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other-expect" id="other-expect" />
                  <Label htmlFor="other-expect">အခြား</Label>
                </div>
              </RadioGroup>
              {formData.expectations === "other-expect" && (
                <Input
                  placeholder="ဖော်ပြရန် *"
                  value={formData.expectationsOther}
                  onChange={(e) => updateFormData("expectationsOther", e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label className="text-base font-medium">
                ၁၀။ ရွေးကောက်ပွဲအပြီး ဖြစ်ပေါ်နိုင်ဆုံး စိုးရိမ်စရာများကဘာတွေဖြစ်မလဲ? (အားလုံးရွေးနိုင်) <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-2">
                {[
                  { id: "violence", label: "နိုင်ငံရေးအကြမ်းဖက်မှု/ပဋိပက္ခ မြင့်တက်လာခြင်း" },
                  { id: "economic-decline", label: "စီးပွားရေးကျဆင်းမှု" },
                  { id: "sanctions", label: "နိုင်ငံတကာပိတ်ဆို့မှုများ ပိုမိုဖြစ်ပေါ်လာခြင်း" },
                  { id: "ethnic-rights", label: "တိုင်းရင်းသားအခွင့်အရေး လျစ်လျူရှုခံရခြင်း" },
                ].map((concern) => (
                  <div key={concern.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={concern.id}
                      checked={formData.concerns.includes(concern.id)}
                      onCheckedChange={(checked) => handleCheckboxChange("concerns", concern.id, checked as boolean)}
                    />
                    <Label htmlFor={concern.id}>{concern.label}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other-concern"
                    checked={formData.concerns.includes("other")}
                    onCheckedChange={(checked) => handleCheckboxChange("concerns", "other", checked as boolean)}
                  />
                  <Label htmlFor="other-concern">အခြား</Label>
                </div>
              </div>
              {formData.concerns.includes("other") && (
                <Input
                  placeholder="ဖော်ပြရန် *"
                  value={formData.concernsOther}
                  onChange={(e) => updateFormData("concernsOther", e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label className="text-base font-medium">
                ၁၁။ မြန်မာနိုင်ငံ၏ အဓိကစိန်ခေါ်မှုများကို ဖြေရှင်းနိုင်မည့် အစိုးရအသစ်ကို ယုံကြည်မျှော်လင့်ပါသလား?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.confidence}
                onValueChange={(value) => updateFormData("confidence", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-confident" id="very-conf" />
                  <Label htmlFor="very-conf">အလွန်ယုံကြည်မျှော်လင့်ပါသည်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat-confident" id="some-conf" />
                  <Label htmlFor="some-conf">အတိုင်းအတာတစ်ခုထိ ယုံကြည်သည်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-very-confident" id="not-conf" />
                  <Label htmlFor="not-conf">သိပ်မယုံကြည်ပါ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-confident" id="no-conf" />
                  <Label htmlFor="no-conf">လုံးဝမယုံကြည်ပါ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-700">အပိုင်း ၅: အလွတ်သဘောဖြေဆိုနိုင်သောမေးခွန်း (ရွေးချယ်နိုင်)</h3>

            <div>
              <Label className="text-base font-medium">၁၂။ ဤရွေးကောက်ပွဲဆိုင်ရာ အခြားထင်မြင်ချက်/အကြံပြုချက်:</Label>
              <Textarea
                placeholder="သင့်ထင်မြင်ချက်များကို ဤနေရာတွင် ရေးသားနိုင်ပါသည်..."
                value={formData.additionalComments}
                onChange={(e) => updateFormData("additionalComments", e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-700">စစ်တမ်းပြီးဆုံးပါပြီ</h3>
            <p className="text-lg text-gray-600">ကျေးဇူးတင်ပါသည်!</p>
            <p className="text-sm text-gray-500">သင့်ထင်မြင်ချက်များသည် မြန်မာနိုင်ငံ၏ ဒီမိုကရေစီလုပ်ငန်းစဉ်ကို နားလည်ရန် အလွန်အရေးကြီးပါသည်။</p>
          </div>
        )

      default:
        return null
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Background Pagoda Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-red-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Card className="max-w-2xl mx-auto shadow-2xl border-amber-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-amber-800">စစ်တမ်းပြီးဆုံးပါပြီ</h1>
                <p className="text-xl text-gray-700">ကျေးဇူးတင်ပါသည်!</p>
                <p className="text-gray-600 leading-relaxed">
                  သင့်ထင်မြင်ချက်များသည် မြန်မာနိုင်ငံ၏ ဒီမိုကရေစီလုပ်ငန်းစဉ်ကို နားလည်ရန် အလွန်အရေးကြီးပါသည်။ သင့်ပါဝင်မှုအတွက် ကျေးဇူးအထူးတင်ရှိပါသည်။
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setCurrentStep(0)
                      setFormData(initialFormData)
                      setIsComplete(false)
                      setValidationErrors([])
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
                  >
                    အသစ်စတင်ရန်
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pagoda Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-red-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Card className="max-w-4xl mx-auto shadow-2xl border-amber-200 transition-all duration-500 ease-in-out transform">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardTitle className="text-center">
              <div className="flex items-center justify-between">
                <div className="w-8"></div>
                <span className="text-lg font-medium">
                  {currentStep < 5 ? `အပိုင်း ${currentStep + 1} / ${totalSteps - 1}` : "ပြီးဆုံး"}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                </div>
              </div>
            </CardTitle>
            <div className="w-full bg-white/20 rounded-full h-2 mt-4">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h4 className="text-red-700 font-medium">ကျေးဇူးပြု၍ အောက်ပါအချက်များကို ဖြည့်စွက်ပါ:</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="transition-all duration-500 ease-in-out transform">{renderStep()}</div>

            <div className="flex justify-between mt-8 pt-6 border-t border-amber-100">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                ယခင်
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isStepValid && currentStep < 4}
                className={`flex items-center gap-2 px-6 ${
                  !isStepValid && currentStep < 4
                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                } text-white`}
              >
                {currentStep === totalSteps - 2 ? "ပြီးဆုံး" : "ရှေ့သို့"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
