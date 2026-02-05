import { JSX, useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import Image from "react-bootstrap/Image";
import { Link, useParams } from "react-router-dom";

interface ChapterMeta {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly description?: string;
  readonly href: string;
  readonly updatedAt: string;
  readonly hasContent: boolean;
  readonly level?: string;
  readonly category?: string[];
  readonly tags?: string[];
  readonly image?: string;
  readonly order?: number;
}

interface CourseMeta {
  readonly courseId: string;
  readonly generatedAt: string;
  readonly chapters: ChapterMeta[];
}

function BookPresentation({
  url,
  bookLocation,
  children,
}: {
  readonly url: string;
  readonly bookLocation: string;
  readonly children: JSX.Element;
}): JSX.Element {
  return (
    <Row className="border p-1 m-1">
      <Col className="col-2">
        <Container>
          <Image src={url} rounded fluid />
        </Container>
      </Col>

      <Col className="col-8">
        {children}
        <Link to={bookLocation}> GO TO</Link>
      </Col>
    </Row>
  );
}

export default function CourseView(): JSX.Element {
  const [meta, setMeta] = useState<CourseMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { course } = useParams();
  const courseId = course ?? "es01";

  useEffect(() => {
    const base = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const url = `${normalizedBase}/courses/${courseId}/meta.json`;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
        return (await res.json()) as CourseMeta;
      })
      .then((data) => setMeta(data))
      .catch((e: any) => setError(e?.message?.toString?.() ?? String(e)))
      .finally(() => setLoading(false));
  }, [courseId]);

  const resolvePublicUrl = (maybePath: string | undefined): string | undefined => {
    if (!maybePath) return undefined;
    if (maybePath.startsWith("http://") || maybePath.startsWith("https://") || maybePath.startsWith("data:")) {
      return maybePath;
    }
    const base = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleaned = maybePath.startsWith("/") ? maybePath.slice(1) : maybePath;
    return `${normalizedBase}/${cleaned}`;
  };

  return (
    <>
      <HeaderComponent />
      <Container>
        {loading && <div className="p-3 text-muted">Loading…</div>}
        {error && <div className="p-3 text-danger">{error}</div>}
        {!loading &&
          !error &&
          meta?.chapters.map((ch) => (
            <BookPresentation
              key={ch.slug}
              bookLocation={ch.href}
              url={
                resolvePublicUrl(ch.image) ??
                "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png"
              }
            >
              <>
                <h4 className="mb-1">{ch.title}</h4>
                {(ch.level ||
                  (ch.category && ch.category.length > 0) ||
                  (ch.tags && ch.tags.length > 0)) && (
                  <div className="mb-2 text-muted small">
                    {ch.level && (
                      <span className="me-2">
                        <strong>Level</strong>: {ch.level}
                      </span>
                    )}
                    {ch.category && ch.category.length > 0 && (
                      <span className="me-2">
                        <strong>Categories</strong>: {ch.category.join(", ")}
                      </span>
                    )}
                    {ch.tags && ch.tags.length > 0 && (
                      <span>
                        <strong>Tags</strong>: {ch.tags.join(", ")}
                      </span>
                    )}
                  </div>
                )}
                {ch.description && <p className="mb-1">{ch.description}</p>}
                {!ch.hasContent && (
                  <p className="text-muted mb-1">Coming soon</p>
                )}
              </>
            </BookPresentation>
          ))}
      </Container>
    </>
  );
}


